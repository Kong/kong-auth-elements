import { onMounted, ref, Ref, watch } from 'vue'
import KongAuthApi from '@/services/kauth-api-client/v1/KongAuthApi'

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
    console.info('redirectToIdp: ', `'${returnTo}'`)

    if (!organizationLoginPath.value) {
      idpIsLoading.value = false
      return
    }

    if (!['konghq.com', 'localhost'].some((path) => returnTo.includes(path))) {
      idpIsLoading.value = false
      console.error("'redirectToIdp' is required and must include konghq.com or localhost.")
      return
    }

    // Prevent additional redirects while processing
    isRedirecting.value = true

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

    // Prevent additional redirects while processing
    isRedirecting.value = true

    // Redirect user to kauth endpoint
    window.location.href = `/kauth/api/authenticate/oidc-callback?code=${code.value}&state=${state.value}`
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
