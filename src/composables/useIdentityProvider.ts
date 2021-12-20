import { onMounted, ref, Ref } from 'vue'
import KongAuthApi from '@/services/KongAuthApi'

interface IdentityProviderComposable {
  idpIsLoading: Ref<boolean>
  shouldTriggerIdpLogin (): boolean
  shouldTriggerIdpAuthentication (): boolean
  redirectToIdp (returnTo?: string, isTest?: boolean): void
  authenticateWithIdp (): void
}

/**
 * Composable function to utilize the IDP-related kauth flow.
 * @export IdentityProviderComposable
 * @param {boolean} initializeOnMounted - If true, automatically handle IDP in the onMounted lifecycle hook.
 * @return {*}  {IdentityProviderComposable}
 */
export default function useIdentityProvider (initializeOnMounted = false): IdentityProviderComposable {
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
      console.warn("'shouldTriggerIdpLogin' should only be called in the 'onMounted' lifecycle hook, or afterwards.")
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
   * Returns if URL contains code and state parameters to use for IDP authentication.
   * @return {*}  {boolean}
   */
  const shouldTriggerIdpAuthentication = (): boolean => {
    // If called before window exists, exit
    if (typeof window === 'undefined') {
      console.warn(
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

  /**
   * Redirect the user to the kauth/authenticate/{org-id} endpoint with an optional returnTo query param.
   * @param {string} [returnTo] - The full URL (including https://) where to return the user to with the code and state.
   */
  const redirectToIdp = (returnTo?: string, isTest = false): void => {
    if (!organizationLoginPath.value) {
      idpIsLoading.value = false
      return
    }

    // If returnTo is set, and starts with 'http', accept as-is. Otherwise, set to 'window.location.origin/login'
    let returnPath = returnTo ? (returnTo.startsWith('http') ? returnTo : window.location.origin + '/login') : ''
    // If returnPath is set, encode for query string
    returnPath = returnPath ? `?returnTo=${encodeURIComponent(returnPath)}` : ''

    // Add parameter for testing, if set
    const testingIdp = isTest ? '&test=true' : ''

    // Redirect user to kauth endpoint
    window.location.href = `${process.env.VUE_APP_AUTH_URL}/kauth/api/authenticate/${organizationLoginPath.value}${returnPath}${testingIdp}`
  }

  const authenticateWithIdp = () => {
    // TODO
    if (!code.value || !state.value) {
      idpIsLoading.value = false
      return
    }
  }

  onMounted(() => {
    // If not set to initialize on mounted, exit
    if (!initializeOnMounted) {
      return
    }

    // Check for IDP login
    if (shouldTriggerIdpLogin()) {
      redirectToIdp('http://example.com/login')
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
