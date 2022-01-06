import { onMounted, ref, Ref, watch } from 'vue'

interface IdentityProviderComposable {
  idpIsLoading: Ref<boolean>
  shouldTriggerIdpLogin (): boolean
  shouldTriggerIdpAuthentication (): boolean
  redirectToIdp (returnTo: string, isTest?: boolean): void
  authenticateWithIdp (): void
}

/**
 * Composable function to utilize the IDP-related kauth flow.
 * @export IdentityProviderComposable
 * @param {ref<boolean>} idpIsEnabled - If true, automatically handle IDP in the onMounted lifecycle hook.
 * @param {ref<string>} idpLoginRedirectTo - Pass the returnTo URL. Must include 'konghq.com' or 'localhost' (localhost does not work currently).
 * @return {*}  {IdentityProviderComposable}
 */
export default function useIdentityProvider (
  idpIsEnabled: Ref<boolean>,
  idpLoginRedirectTo: Ref<string>,
): IdentityProviderComposable {
  const idpIsLoading = ref(false)
  const isRedirecting = ref(false)
  const organizationLoginPath = ref<string>('')
  const code = ref<string>('')
  const state = ref<string>('')
  const apiVersion = ref('v1')

  /**
   * Returns if user is on /login/{org-id} route in container application with valid org-id in path.
   * @return {*}  {boolean}
   */
  const shouldTriggerIdpLogin = (): boolean => {
    // If called before window exists, exit
    if (typeof window === 'undefined') {
      console.error("'shouldTriggerIdpLogin' should only be called in the 'onMounted' lifecycle hook, or afterwards.")
      return false
    }

    // If redirectTo value is not set, exit
    if (!idpLoginRedirectTo.value.trim()) {
      return false
    }

    const urlPath: string = window.location.pathname
    const urlPathArray: string[] = urlPath.split('/')

    // Check for IDP organization login path (only on login page, just in case)
    if (urlPathArray[1].toLowerCase() !== 'login' || !urlPathArray[2]) {
      return false
    }

    // Trigger loading
    idpIsLoading.value = true

    // Set login path
    organizationLoginPath.value = urlPathArray[2]

    return true
  }

  /**
   * Redirect the user to the kauth/authenticate/{org-id} endpoint, and provide a returnTo path. Optionally indicate whether you are testing the config.
   * @param {string} [returnTo] - The full URL (including https://) where to return the user to with the code and state.
   */
  const redirectToIdp = (returnTo: string, isTest = false): void => {
    if (!organizationLoginPath.value) {
      idpIsLoading.value = false
      return
    }

    // If returnTo URL does not contain valid domain
    if (!['konghq.com', 'localhost'].some((path) => returnTo.includes(path))) {
      idpIsLoading.value = false
      // Console warning references the element prop name instead of local variable
      console.error("'idpLoginReturnTo' is required and must include 'konghq.com' or 'localhost'.")
      return
    }

    // Create a URL from returnTo and encode for query string. Fail if not a valid URL.
    let returnToParam

    try {
      // Create new URL from returnTo
      const returnToUrl = new URL(returnTo)
      // Append a query string to let container app know the user went through IdP auth
      returnToUrl.searchParams.append('fromIdp', 'true')
      // Encode for query string param
      returnToParam = `returnTo=${encodeURIComponent(returnToUrl.href)}`
    } catch (_) {
      idpIsLoading.value = false
      // Console warning references the element prop name instead of local variable
      console.error("'idpLoginReturnTo' must be a valid URL.")
      return
    }

    // Prevent additional redirects while processing
    isRedirecting.value = true

    // Add parameter for testing, if set
    const testingIdpParam = isTest ? 'test=true' : null

    // Combine URL params, skipping any that are empty
    const redirectParams = '?' + [returnToParam, testingIdpParam].filter(Boolean).join('&')

    // Redirect user to kauth endpoint
    window.location.href = `/kauth/api/${apiVersion.value}/authenticate/${organizationLoginPath.value}${redirectParams}`
  }

  /**
   * Returns if URL contains code and state parameters to use for IDP authentication.
   * @return {*}  {boolean}
   */
  const shouldTriggerIdpAuthentication = (): boolean => {
    // If called before window exists, exit
    if (typeof window === 'undefined') {
      console.error(
        "'shouldTriggerIdpAuthentication' should only be called in the 'onMounted' lifecycle hook, or afterwards.",
      )
      return false
    }

    const urlParams = new URLSearchParams(window.location.search)
    code.value = urlParams.get('code') || ''
    state.value = urlParams.get('state') || ''

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

    // Redirect user to kauth endpoint
    window.location.href = `/kauth/api/${apiVersion.value}/authenticate/oidc-callback?code=${code.value}&state=${state.value}`
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
      return
    }
  })

  return {
    idpIsLoading,
    shouldTriggerIdpLogin,
    shouldTriggerIdpAuthentication,
    redirectToIdp,
    authenticateWithIdp,
  }
}
