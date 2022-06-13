<template>
  <div class="kong-auth-login-form">
    <KSkeleton
      v-if="currentState.matches('from_url') || currentState.matches('verify_email')"
      class="idp-loading"
      type="fullscreen-kong"
      :delay-milliseconds="0"
      data-testid="kong-auth-login-gruce-loader"
    />

    <div v-else>
      <div v-if="idpLoginEnabled && (userEntity === 'developer' || (userEntity === 'user' && isIdpLogin))">
        <KButton
          appearance="outline"
          :is-rounded="false"
          class="justify-content-center w-100 type-lg"
          data-testid="kong-auth-login-sso"
          :aria-label="['pending', 'success'].some(currentState.matches) ? undefined : messages.login.loginTextSSOAriaLabel"
          :disabled="loginBtnSSODisabled"
          @click.prevent="redirectToIdp(idpLoginReturnTo)"
        >
          <KIcon
            :icon="idpIsLoading ? 'spinner' : 'organization'"
            size="16"
            class="pr-0 mr-2"
            :color="loginBtnSSODisabled ? 'var(--grey-400, #b6b6bd)' : 'var(--blue-500, #1155cb)'"
          />
          {{ messages.login.loginTextSSO }}
        </KButton>

        <p v-if="loginWithCredentialsLinkIsVisible" class="basic-auth-link mt-5 text-center">
          <a
            @click.prevent="loginWithCredentials"
            class="color-blue-500"
            href="#"
            data-testid="kong-auth-login-basic-auth-link"
          >{{ messages.login.loginWithCredentials }}</a>
        </p>
      </div>

      <div v-if="loginDividerIsVisible" class="kong-auth-element-form-divider">{{ messages.general.dividerTextOr }}</div>

      <div v-if="currentState.matches('error') && error" class="my-3">
        <ErrorMessage :error="error" />
      </div>

      <div v-else-if="currentState.matches('reset_password')" class="my-3">
        <KAlert
          :alert-message="messages.login.passwordResetSuccess"
          appearance="success"
          class="justify-content-center"
          data-testid="kong-auth-login-password-reset-message"
        />
      </div>

      <div v-else-if="currentState.matches('confirmed_email')" class="my-3">
        <KAlert
          :alert-message="messages.login.confirmedEmailSuccess"
          appearance="success"
          class="justify-content-center"
          data-testid="kong-auth-login-confirmed-email-message"
        />
      </div>

      <div v-else-if="currentState.matches('from_register')" class="my-3">
        <KAlert
          :alert-message="registerSuccessText"
          appearance="success"
          class="justify-content-center"
          data-testid="kong-auth-login-register-success-message"
        />
      </div>

      <form
        v-if="basicAuthLoginEnabled || forceBasicAuth || (!basicAuthLoginEnabled && !idpLoginEnabled)"
        class="login-form"
        @submit.prevent="submitForm"
        novalidate
        data-testid="kong-auth-login-form"
      >
        <p
          v-if="instructionText"
          class="color-black-45"
          data-testid="kong-auth-login-instruction-text"
        >{{ instructionText }}</p>

          <KInput
            id="email"
            v-model.trim="email"
            type="email"
            label="Email *"
            class="w-100 mb-5"
            autocomplete="username"
            autocapitalize="off"
            :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
            required
            data-testid="kong-auth-login-email"
          />

          <KInput
            id="password"
            v-model="password"
            type="password"
            label="Password *"
            class="w-100"
            autocomplete="current-password"
            :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
            required
            data-testid="kong-auth-login-password"
          />

        <p v-if="showForgotPasswordLink" class="help mt-3">
          <a
            @click.prevent="$emit('click-forgot-password-link')"
            class="color-blue-500"
            href="#"
            data-testid="kong-auth-login-forgot-password-link"
          >{{ forgotPasswordLinkText }}</a>
        </p>

        <KButton
          type="submit"
          appearance="primary"
          :is-rounded="false"
          class="justify-content-center w-100 mt-6 type-lg"
          :disabled="loginBtnDisabled"
          data-testid="kong-auth-login-submit"
        >
          <KIcon
            v-if="['pending', 'success'].some(currentState.matches)"
            icon="spinner"
            size="16"
            class="pr-0 mr-2"
          />
          {{ loginBtnText }}
        </KButton>

        <div v-if="showRegisterLink" class="text-center mt-5">
          <p class="color-black-85 bold-500">
            <span data-testid="kong-auth-login-register-help-text">{{ registerLinkHelpText }}</span>
            <a
              @click.prevent="$emit('click-register-link')"
              class="color-blue-500"
              href="#"
              data-testid="kong-auth-login-register-link"
            >{{ registerLinkText }}</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, Ref, toRefs, computed, onMounted, watch } from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import useKongAuthApi from '@/composables/useKongAuthApi'
import { DeveloperAPIV1VerifyRequest, DeveloperAPIV1VerifyResponse, EmailverificationsVerifyRequest, EmailverificationsVerifyResponse } from '@kong/kauth-client-typescript-axios'
import { AxiosResponse } from 'axios'
import { win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useIdentityProvider from '@/composables/useIdentityProvider'
import useI18n from '@/composables/useI18n'
// Components
import { KAlert, KButton, KIcon, KInput, KSkeleton } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

export const loginEmits = {
  'login-success': null,
  'verify-email-success': (payload: { email: string, resetToken?: string }): boolean => {
    return !!payload?.email.trim()
  },
  'click-forgot-password-link': null,
  'click-register-link': null,
  'idp-is-loading': (payload: { isLoading: boolean }): boolean => {
    return typeof payload?.isLoading === 'boolean'
  },
}

export default defineComponent({
  name: 'LoginForm',

  components: {
    ErrorMessage,
    KAlert,
    KButton,
    KIcon,
    KInput,
    KSkeleton,
  },

  // Define emits with validation, where necessary
  emits: loginEmits,

  setup(props, { emit }) {
    const { userEntity, developerConfig, customErrorHandler, lang } = useConfigOptions()
    const { api } = useKongAuthApi()
    const { messages } = useI18n(lang)

    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const instructionText: Ref<string> = inject('instruction-text', ref(''))
    const showForgotPasswordLink: Ref<boolean> = inject('show-forgot-password-link', ref(false))
    const forgotPasswordLinkText: Ref<string> = inject('forgot-password-link-text', ref(messages.login.forgotPasswordLinkText))
    const showRegisterLink: Ref<boolean> = inject('show-register-link', ref(false))
    const registerLinkText: Ref<string> = inject('register-link-text', ref(messages.login.registerLinkText))
    const registerLinkHelpText: Ref<string> = inject('register-link-help-text', ref(messages.login.registerLinkHelpText))
    const registerSuccessText: Ref<string> = inject('register-success-text', ref(messages.login.registerSuccess))
    const basicAuthLoginEnabled: Ref<boolean> = inject('basic-auth-login-enabled', ref(true))
    const idpLoginEnabled: Ref<boolean> = inject('idp-login-enabled', ref(false))
    const idpLoginReturnTo: Ref<string> = inject('idp-login-return-to', ref(''))

    const formData = reactive({
      email: '',
      password: '',
    })
    const error = ref<any>(null)
    const fieldsHaveError = ref(false)
    const forceBasicAuth = ref(false)
    const loginWithCredentialsLinkIsVisible = computed((): boolean => userEntity !== 'developer' && !basicAuthLoginEnabled.value && !forceBasicAuth.value)
    const loginDividerIsVisible = computed((): boolean => (basicAuthLoginEnabled.value && idpLoginEnabled.value && (userEntity === 'developer' || (userEntity === 'user' && isIdpLogin.value))) || forceBasicAuth.value)

    // Setup and automatically trigger IDP (or ignore it, depending on the props)
    // Passing the refs on purpose so values are reactive.
    const { isIdpLogin, idpIsLoading, redirectToIdp } = useIdentityProvider(basicAuthLoginEnabled, idpLoginEnabled, idpLoginReturnTo)

    // Automatically trigger state change based on IDP
    watch(idpIsLoading, (val) => {
      if (val) {
        send('FROM_URL')
      }
      emit('idp-is-loading', {
        isLoading: val,
      })
    })

    const {
      state: currentState,
      send,
    } = useMachine(
      createMachine({
        id: 'AUTH_LOGIN',
        initial: 'idle',
        states: {
          idle: {
            on: {
              FROM_REGISTER: 'from_register',
              FROM_URL: 'from_url',
              VERIFY_EMAIL: 'verify_email',
              CONFIRMED_EMAIL: 'confirmed_email',
              RESET_PASSWORD: 'reset_password',
              SUBMIT_LOGIN: 'pending',
              REJECT: 'error',
            },
          },
          confirmed_email: {
            on: {
              SUBMIT_LOGIN: 'pending',
              REJECT: 'error',
            },
          },
          from_register: {
            on: {
              SUBMIT_LOGIN: 'pending',
              REJECT: 'error',
            },
          },
          reset_password: {
            on: {
              SUBMIT_LOGIN: 'pending',
              REJECT: 'error',
            },
          },
          from_url: {
            on: {
              IDP_PARAMS: 'pending',
              REJECT: 'error',
            },
          },
          verify_email: {
            on: {
              RESOLVE: 'idle',
              SUBMIT_LOGIN: 'pending',
              REJECT: 'error',
            },
          },
          pending: {
            on: {
              RESOLVE: 'success',
              REJECT: 'error',
            },
          },
          error: {
            on: {
              SUBMIT_LOGIN: 'pending',
            },
          },
          success: {},
        },
      }),
    )

    const loginBtnText = computed((): string => {
      if (['pending'].some(currentState.value.matches)) {
        return messages.login.submittingText
      } else if (['success'].some(currentState.value.matches)) {
        return ''
      }

      return messages.login.loginText
    })

    const loginBtnDisabled = computed((): boolean => {
      return (
        (!formData.email || !formData.password) || ['pending', 'success'].some(currentState.value.matches)
      )
    })

    const loginBtnSSODisabled = computed((): boolean => {
      return idpIsLoading.value || ['pending', 'success'].some(currentState.value.matches)
    })

    const setUserStatusCookie = async () => {
      // return domain if valid, empty string if not a valid domain (like localhost)
      const getDomain = () => {
        const hostname = win.getLocationHostname()

        return hostname.indexOf('.') > -1
          ? `domain=${hostname.substring(hostname.lastIndexOf('.', hostname.lastIndexOf('.') - 1) + 1)};`
          : ''
      }
      const date = new Date()

      // Set expiration date to two months from current date
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 60)
      document.cookie = `userStatus=active; path=/; ${getDomain()} expires=${date.toUTCString()};`
    }

    const verifyEmailAddress = async (token: EmailverificationsVerifyRequest | DeveloperAPIV1VerifyRequest): Promise<void> => {
      try {
        send('VERIFY_EMAIL')

        // setTimeout for simulated feedback
        await new Promise((resolve) => setTimeout(resolve, 250))

        const verificationResponse: AxiosResponse<EmailverificationsVerifyResponse | DeveloperAPIV1VerifyResponse> = userEntity === 'developer' ? await api.emailVerification.verifyDeveloperEmail(token) : await api.emailVerification.verifyUserEmail(token)

        send('RESOLVE')

        setUserStatusCookie()

        formData.email = verificationResponse.data.email || ''
        send('CONFIRMED_EMAIL')

        emit('verify-email-success', {
          email: formData.email,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resetToken: verificationResponse.data.resetToken ? verificationResponse.data.resetToken : undefined,
        })
      } catch (err: any) {
        send('REJECT')

        fieldsHaveError.value = false

        const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'verify-email-request', element: 'kong-auth-login' })

        if (customEndpointErrorMessage) {
          error.value = {
            status: undefined,
            statusText: customEndpointErrorMessage,
          }
          return
        }

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    const submitForm = async (): Promise<void> => {
      send('SUBMIT_LOGIN')

      // Reset form errors
      error.value = null
      fieldsHaveError.value = false

      if (!formData.email || !formData.password) {
        send('REJECT')

        fieldsHaveError.value = true

        error.value = {
          status: 401,
        }

        return
      }

      // setTimeout for simulated feedback
      await new Promise((resolve) => setTimeout(resolve, 250))

      try {
        let loginResponse

        if (userEntity === 'developer') {
          loginResponse = await api.authentication.authenticateDeveloper({
            username: formData.email,
            password: formData.password,
            portal_id: developerConfig?.portalId || '',
          })
        } else {
          loginResponse = await api.authentication.authenticateUser({
            username: formData.email,
            password: formData.password,
          })
        }

        if (loginResponse.status >= 200 && loginResponse.status < 300) {
          send('RESOLVE')
          emit('login-success')
          return
        }

        send('REJECT')
        fieldsHaveError.value = true

        if (loginResponse.status === 403) {
          return
        }
      } catch (err: any) {
        send('REJECT')

        fieldsHaveError.value = true

        const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'authenticate-request', element: 'kong-auth-login' })

        if (customEndpointErrorMessage) {
          error.value = {
            status: undefined,
            statusText: customEndpointErrorMessage,
          }
          return
        }

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    const loginWithCredentials = (): void => {
      // Redirect the user to the same login page without anything else in the path
      win.setLocationHref(win.getLocationOrigin() + '/login?basicAuth=true')
    }

    onMounted(async () => {
      // Get URL params
      const urlParams = new URLSearchParams(win.getLocationSearch())

      // If basicAuth query parameter is present, force-show the basic auth form (for org admins)
      forceBasicAuth.value = !!urlParams?.get('basicAuth') && urlParams?.get('basicAuth') === 'true'

      // If token in URL params
      const token = urlParams?.get('token')
      if (token) {
        // Verify email address and set email on success
        await verifyEmailAddress({ token })
        return
      }

      // Set email if in route params
      const emailInParams = urlParams?.get('email')
      if (emailInParams) {
        formData.email = emailInParams
      }

      // Check if coming from password reset
      if (urlParams.get('passwordReset')) {
        send('RESET_PASSWORD')
      }

      // If coming from registration (or an invite registration)
      if (urlParams.get('registered')) {
        setUserStatusCookie()
        send('FROM_REGISTER')
      }
    })

    return {
      instructionText,
      showForgotPasswordLink,
      forgotPasswordLinkText,
      showRegisterLink,
      registerLinkHelpText,
      registerLinkText,
      registerSuccessText,
      messages,
      loginBtnText,
      loginBtnDisabled,
      loginBtnSSODisabled,
      currentState,
      submitForm,
      loginWithCredentials,
      error,
      fieldsHaveError,
      loginWithCredentialsLinkIsVisible,
      loginDividerIsVisible,
      idpLoginEnabled,
      basicAuthLoginEnabled,
      forceBasicAuth,
      isIdpLogin,
      idpIsLoading,
      userEntity,
      idpLoginReturnTo,
      redirectToIdp,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
