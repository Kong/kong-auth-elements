import { onMounted, ref, Ref, watch } from 'vue'
import useConfigOptions from '@/composables/useConfigOptions'
import { win } from '@/utils'

export interface IdentityProviderComposable {
  isIdpLogin: Ref<boolean>
  idpIsLoading: Ref<boolean>
  shouldTriggerIdpLogin(): boolean
  shouldTriggerIdpAuthentication(): boolean
  redirectToIdp(returnTo: string): void
  authenticateWithIdp(): void
}

/**
 * Composable function to utilize the IDP-related kauth flow.
 * @export IdentityProviderComposable
 * @param {ref<boolean>} basicAuthIsEnabled - If true, user can log in with basic auth credentials.
 * @param {ref<boolean>} idpIsEnabled - If true, automatically handle IDP in the onMounted lifecycle hook.
 * @param {ref<string>} idpLoginRedirectTo - Pass the returnTo URL.
 * @return {*} {IdentityProviderComposable}
 */
export default function useIdentityProvider(
  basicAuthIsEnabled: Ref<boolean>,
  idpIsEnabled: Ref<boolean>,
  idpLoginRedirectTo: Ref<string>,
): IdentityProviderComposable {
  const { apiBaseUrl, userEntity, developerConfig } = useConfigOptions()
  const isIdpLogin = ref(false)
  const idpIsLoading = ref(false)
  const isRedirecting = ref(false)
  const organizationLoginPath = ref<string>('')
  // TODO:
  const code = ref<string>('')
  const state = ref<string>('')

  const apiVersion = ref('v1')

  /**
   * Returns true if user is on /login/{org-id} route in container application with valid org-id in path, and no logout=true in query string.
   * @return {*}  {boolean}
   */
  const shouldTriggerIdpLogin = (): boolean => {
    // If called before window exists, exit
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.error("'shouldTriggerIdpLogin' should only be called in the 'onMounted' lifecycle hook, or afterwards")
      return false
    }

    const urlPath: string = win.getLocationPathname()
    const urlPathArray: string[] = urlPath.split('/')

    if (userEntity === 'user') {
      // Check for IDP organization login path (only on login page, just in case)
      isIdpLogin.value = urlPathArray[1].toLowerCase() === 'login' && !!urlPathArray[2]
      // Set login path
      organizationLoginPath.value = urlPathArray[2]
    } else if (userEntity === 'developer') {
      // If only IdP login is enabled, go ahead and auto-trigger
      // TODO: Do not auto-trigger; require the user to click a button since Portal doesn't use login path
      isIdpLogin.value = idpIsEnabled.value === true && basicAuthIsEnabled.value === false
    }

    // Get URL params
    const urlParams: URLSearchParams = new URLSearchParams(win.getLocationSearch())

    // If not IdP login, or if logout in URL params (user came from logout), exit
    if (!isIdpLogin.value || !!urlParams?.get('logout')) {
      return false
    }

    // If redirectTo value is not set, exit
    if (!idpLoginRedirectTo.value.trim()) {
      return false
    }

    // Trigger loading
    idpIsLoading.value = true

    return true
  }

  /**
   * Redirect the user to the kauth/authenticate/{org-id} endpoint, and provide a returnTo path.
   * @param {string} [returnTo] - The full URL (including https://) where to return the user to with the code and state.
   */
  const redirectToIdp = (returnTo: string): void => {
    idpIsLoading.value = true

    if (userEntity !== 'developer' && !organizationLoginPath.value) {
      idpIsLoading.value = false
      return
    }

    // Create a URL from returnTo and encode for query string. Fail if not a valid URL.
    let returnToParam

    try {
      // Create new URL from returnTo, wrapped in try/catch to construct the URL object
      const returnToUrl = new URL(returnTo)

      // Encode for query string param
      returnToParam = `returnTo=${encodeURIComponent(returnToUrl.href)}`
    } catch (_) {
      idpIsLoading.value = false
      // Console warning references the element prop name instead of local variable
      // eslint-disable-next-line no-console
      console.error("'idpLoginReturnTo' must be a valid URL")
      return
    }

    // Prevent additional redirects while processing
    isRedirecting.value = true

    // Combine URL params, skipping any that are empty
    const redirectParams = '?' + [returnToParam].filter(Boolean).join('&')

    // TODO: If userEntity is developer, redirect user to the IdP developer auth endpoint
    if (userEntity === 'developer') {
      if (!developerConfig?.portalId) {
        // Reset loading state
        idpIsLoading.value = false

        // Exit early
        console.error("'portalId' is required")
        return
      }

      win.setLocationHref(`${apiBaseUrl}/api/${apiVersion.value}/developer-authenticate/${developerConfig?.portalId}${redirectParams}`)

      return
    }

    // Redirect user to the IdP user auth endpoint
    win.setLocationHref(`${apiBaseUrl}/api/${apiVersion.value}/authenticate/${organizationLoginPath.value}${redirectParams}`)
  }

  /**
   * Returns if URL contains code and state parameters to use for IDP authentication.
   * @return {*}  {boolean}
   */
  const shouldTriggerIdpAuthentication = (): boolean => {
    // If called before window exists, exit
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.error(
        "'shouldTriggerIdpAuthentication' should only be called in the 'onMounted' lifecycle hook, or afterwards",
      )
      return false
    }

    // TODO: pass along all URL query parameters

    const urlParams: URLSearchParams = new URLSearchParams(win.getLocationSearch())
    code.value = urlParams?.get('code') || ''
    state.value = urlParams?.get('state') || ''

    // Check for url params
    if (!code.value || !state.value) {
      code.value = ''
      state.value = ''
      return false
    }

    // Trigger loading
    idpIsLoading.value = true

    return true
  }

  const authenticateWithIdp = () => {
    if (!code.value || !state.value) {
      idpIsLoading.value = false
      return
    }

    // Prevent additional redirects while processing
    isRedirecting.value = true

    if (userEntity === 'developer') {
      // Redirect developer to kauth endpoint
      win.setLocationHref(`${apiBaseUrl}/api/${apiVersion.value}/developer-authenticate/oidc-callback?code=${code.value}&state=${state.value}`)
      return
    }

    // Redirect user to kauth endpoint
    win.setLocationHref(`${apiBaseUrl}/api/${apiVersion.value}/authenticate/oidc-callback?code=${code.value}&state=${state.value}`)
  }

  // Add watcher to allow `kong-auth-login` element time to load and retrigger redirect.
  // `idp-login-return-to` prop value will likely not be available ASAP onMounted within containing app, so this will still fire.
  watch(idpLoginRedirectTo, (loginUrl) => {
    if (idpIsEnabled.value && !!loginUrl.trim() && shouldTriggerIdpLogin() && !isRedirecting.value) {
      redirectToIdp(loginUrl)
    }
  })

  onMounted(() => {
    // If IDP is not enabled on login component, do not trigger listeners in onMounted function
    if (!idpIsEnabled.value) {
      return
    }

    // Check for IDP login
    if (shouldTriggerIdpLogin()) {
      redirectToIdp(idpLoginRedirectTo.value)
      return
    }

    if (shouldTriggerIdpAuthentication()) {
      authenticateWithIdp()
    }
  })

  return {
    isIdpLogin,
    idpIsLoading,
    shouldTriggerIdpLogin,
    shouldTriggerIdpAuthentication,
    redirectToIdp,
    authenticateWithIdp,
  }
}
