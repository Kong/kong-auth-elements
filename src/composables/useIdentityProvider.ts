import { onMounted, ref, Ref, watchEffect } from 'vue'
import useConfigOptions from '@/composables/useConfigOptions'
import { win } from '@/utils'

export interface IdentityProviderComposable {
  isIdpLogin: Ref<boolean>
  idpIsLoading: Ref<boolean>
  shouldTriggerIdpLogin(): boolean
  shouldTriggerIdpAuthentication(): boolean
  redirectToIdp(callbackUrl: string, returnTo: string): void
  authenticateWithIdp(): void
}

/**
 * Composable function to utilize the IDP-related kauth flow.
 * @export IdentityProviderComposable
 * @param {ref<boolean>} basicAuthIsEnabled - If true, user can log in with basic auth credentials.
 * @param {ref<boolean>} idpIsEnabled - If true, automatically handle IDP in the onMounted lifecycle hook.
 * @param {ref<string>} idpLoginCallbackUrl - Pass the OIDC callback URL; typically ends in `/login`
 * @param {ref<string>} idpLoginRedirectTo - Pass the returnTo URL.
 * @return {*} {IdentityProviderComposable}
 */
export default function useIdentityProvider(
  basicAuthIsEnabled: Ref<boolean>,
  idpIsEnabled: Ref<boolean>,
  idpLoginCallbackUrl: Ref<string>,
  idpLoginRedirectTo: Ref<string>,
): IdentityProviderComposable {
  const { apiBaseUrl, userEntity, developerConfig } = useConfigOptions()
  const isIdpLogin = ref(false)
  const idpIsLoading = ref(false)
  const isRedirecting = ref(false)
  const organizationLoginPath = ref<string>('')
  const apiVersion = ref('v1')
  // 'code' and 'state' are the only currently required oidc-callback query parameters
  const code = ref<string>('')
  const state = ref<string>('')
  // When we redirect to the oidc-callback endpoint, we want to send along all provided query parameters
  const oidcQueryParams = ref<URLSearchParams|null>(null)

  /**
   * Returns true if user is on /login/{org-id} (user) or /login/sso (developer) route in container application, and no logout=true in query string.
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
      // Check for /login/sso path (only on login page, and 'sso' is second part of URL split)
      isIdpLogin.value = urlPathArray[1].toLowerCase() === 'login' && !!urlPathArray[2] && urlPathArray[2] === 'sso'

      // If developer is on /login/{string} that is not equal to 'sso' redirect back to the normal login page
      if (!isIdpLogin.value && urlPathArray[1].toLowerCase() === 'login' && !!urlPathArray[2] && urlPathArray[2] !== 'sso') {
        win.setLocationHref(win.getLocationOrigin() + '/login')
      }
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
  const redirectToIdp = (callbackUrl: string, returnTo: string): void => {
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

    // Create a URL from callbackUrl and encode for query string. Fail if not a valid URL.
    let callbackUrlParam

    try {
      // Create new URL from callbackUrl, wrapped in try/catch to construct the URL object
      // IMPORTANT: Fallback to `${window.location.origin}/login`
      const oidcCallbackUrl = new URL(callbackUrl || win.getLocationOrigin() + '/login')

      // Encode for query string param
      callbackUrlParam = `callback_url=${encodeURIComponent(oidcCallbackUrl.href)}`
    } catch (_) {
      idpIsLoading.value = false
      // Console warning references the element prop name instead of local variable
      // eslint-disable-next-line no-console
      console.error("'idpLoginCallbackUrl' must be a valid URL")
      return
    }

    // Prevent additional redirects while processing
    isRedirecting.value = true

    // Create an array to hold the URL params
    const urlParams = []

    // Always add the returnTo param
    urlParams.push(returnToParam)
    // If `user`, add the callback_url param
    if (userEntity === 'user') {
      urlParams.push(callbackUrlParam)
    }

    // Combine URL params, skipping any that are empty
    const redirectParams = '?' + urlParams.filter(Boolean).join('&')

    if (userEntity === 'developer') {
      if (!developerConfig?.portalId) {
        // Reset loading state
        idpIsLoading.value = false

        // Exit early
        console.error("'portalId' is required")
        return
      }

      win.setLocationHref(`${apiBaseUrl}/api/v2/developer/authenticate/sso${redirectParams}`)

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

    try {
      // Create new URL from returnTo, wrapped in try/catch to construct the URL object
      const currentUrl = new URL(win.getLocationHref())
      oidcQueryParams.value = new URLSearchParams(currentUrl.search)
    } catch (_) {
      oidcQueryParams.value = null
      console.error(
        "'shouldTriggerIdpAuthentication' could not extract the required OIDC query parameters",
      )
      return false
    }

    // We need to ensure code and state are set (required)
    code.value = oidcQueryParams.value?.get('code') || ''
    state.value = oidcQueryParams.value?.get('state') || ''

    // Check for required url params
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
    // Ensure required parameters are set
    if (!code.value || !state.value) {
      idpIsLoading.value = false
      return
    }

    // Prevent additional redirects while processing
    isRedirecting.value = true

    if (userEntity === 'developer') {
      // Redirect developer to kauth endpoint
      win.setLocationHref(`${apiBaseUrl}/api/v2/developer/authenticate/oidc-callback?${oidcQueryParams.value?.toString()}`)
      return
    }

    // Redirect user to kauth endpoint
    win.setLocationHref(`${apiBaseUrl}/api/${apiVersion.value}/authenticate/oidc-callback?${oidcQueryParams.value?.toString()}`)
  }

  // Add watcher to allow `kong-auth-login` element time to load and retrigger redirect.
  // `idp-login-return-to` prop value will likely not be available ASAP onMounted within containing app, so this will still fire.
  watchEffect(() => {
    if (idpIsEnabled.value && !!String(idpLoginRedirectTo.value || '').trim() && !!String(idpLoginCallbackUrl.value || '').trim() && shouldTriggerIdpLogin() && !isRedirecting.value) {
      redirectToIdp(idpLoginCallbackUrl.value, idpLoginRedirectTo.value)
    }
  })

  onMounted(() => {
    // If IDP is not enabled on login component, do not trigger listeners in onMounted function
    if (!idpIsEnabled.value) {
      return
    }

    // Check for IDP login
    if (shouldTriggerIdpLogin()) {
      redirectToIdp(idpLoginCallbackUrl.value, idpLoginRedirectTo.value)
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
