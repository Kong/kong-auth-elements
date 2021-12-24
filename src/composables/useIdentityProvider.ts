import { onMounted, ref, Ref } from 'vue'
import KongAuthApi from '@/services/KongAuthApi'

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
 * @param {boolean} initializeOnMounted - If true, automatically handle IDP in the onMounted lifecycle hook.
 * @param {string} idpLoginRedirectTo - Pass the returnTo URL. Must include 'konghq.com' or 'localhost' (localhost does not work currently).
 * @return {*}  {IdentityProviderComposable}
 */
export default function useIdentityProvider (
  initializeOnMounted: boolean,
  idpLoginRedirectTo: string,
): IdentityProviderComposable {
  const idpIsLoading = ref(false)
  const organizationLoginPath = ref<string>('')
  const code = ref<string>('')
  const state = ref<string>('')
  const $api = new KongAuthApi()

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

    if (!['konghq.com', 'localhost'].some((path) => returnTo.includes(path))) {
      idpIsLoading.value = false
      console.error("'redirectToIdp' is required and must include konghq.com or localhost.")
      return
    }

    // If returnTo is set, and starts with 'http', accept as-is. Otherwise, set to 'window.location.origin/login'. Also encode for query string.
    const returnToParam = `returnTo=${encodeURIComponent(
      returnTo.startsWith('http') ? returnTo : window.location.origin + '/login',
    )}`

    // Add parameter for testing, if set
    const testingIdpParam = isTest ? 'test=true' : null

    // Combine URL params, skipping any that are empty
    const redirectParams = '?' + [returnToParam, testingIdpParam].filter(Boolean).join('&')

    // Redirect user to kauth endpoint
    window.location.href = `/kauth/api/authenticate/${organizationLoginPath.value}${redirectParams}`
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

    // Redirect user to kauth endpoint
    window.location.href = `/kauth/api/authenticate/oidc-callback?code=${code.value}&state=${state.value}`
  }

  onMounted(() => {
    // If not set to initialize on mounted, exit
    if (!initializeOnMounted) {
      return
    }

    // Check for IDP login
    if (shouldTriggerIdpLogin()) {
      redirectToIdp(idpLoginRedirectTo)
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
