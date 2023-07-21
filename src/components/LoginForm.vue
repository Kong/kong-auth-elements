<template>
  <div class="kong-auth-login-form">
    <KSkeleton
      v-if="currentState.matches('from_url') || currentState.matches('verify_email')"
      class="idp-loading"
      data-testid="kong-auth-login-gruce-loader"
      :delay-milliseconds="0"
      :type="userEntity === 'developer' ? 'fullscreen-generic' : 'fullscreen-kong'"
    />

    <div v-else>
      <div v-if="idpLoginEnabled && (userEntity === 'developer' || (userEntity === 'user' && isIdpLogin))">
        <KButton
          appearance="outline"
          :aria-label="['pending', 'success'].some(currentState.matches) ? undefined : messages.login.loginTextSSOAriaLabel"
          class="login-seo-button"
          data-testid="kong-auth-login-sso"
          :disabled="loginBtnSSODisabled"
          @click.prevent="redirectToIdp(idpLoginReturnTo)"
        >
          <KIcon
            color="currentColor"
            :icon="idpIsLoading ? 'spinner' : 'organization'"
            :size="KUI_ICON_SIZE_30"
          />
          {{ messages.login.loginTextSSO }}
        </KButton>

        <p v-if="loginWithCredentialsLinkIsVisible" class="basic-auth-link">
          <a
            data-testid="kong-auth-login-basic-auth-link"
            href="#"
            @click.prevent="loginWithCredentials"
          >{{ messages.login.loginWithCredentials }}</a>
        </p>
      </div>

      <div v-if="loginDividerIsVisible" class="kong-auth-element-form-divider">{{ messages.general.dividerTextOr }}</div>

      <div v-if="currentState.matches('error') && error" class="form-error">
        <ErrorMessage :error="error" />
      </div>

      <div v-else-if="currentState.matches('reset_password')" class="form-error">
        <KAlert
          :alert-message="messages.login.passwordResetSuccess"
          appearance="success"
          class="justify-content-center"
          data-testid="kong-auth-login-password-reset-message"
        />
      </div>

      <div v-else-if="currentState.matches('confirmed_email')" class="form-error">
        <KAlert
          :alert-message="messages.login.confirmedEmailSuccess"
          appearance="success"
          class="justify-content-center"
          data-testid="kong-auth-login-confirmed-email-message"
        />
      </div>

      <div v-else-if="currentState.matches('from_register')" class="form-error">
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
        data-testid="kong-auth-login-form"
        novalidate
        @submit.prevent="submitForm"
      >
        <p
          v-if="instructionText"
          class="instruction-text"
          data-testid="kong-auth-login-instruction-text"
        >{{ instructionText }}</p>

          <KInput
            id="email"
            v-model.trim="formData.email"
            autocapitalize="off"
            autocomplete="username"
            class="kong-auth-input"
            data-testid="kong-auth-login-email"
            :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
            :label="`${messages.inputLabels.email}`"
            required
            type="email"
            @animationstart="checkAutofill"
          />

          <KInput
            id="password"
            v-model.trim="formData.password"
            autocomplete="current-password"
            class="kong-auth-input"
            data-testid="kong-auth-login-password"
            :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
            :label="`${messages.inputLabels.password}`"
            required
            type="password"
            @animationstart="checkAutofill"
          />

        <p v-if="showForgotPasswordLink" class="forgot-password-link">
          <a
            data-testid="kong-auth-login-forgot-password-link"
            href="#"
            @click.prevent="$emit('click-forgot-password-link')"
          >{{ forgotPasswordLinkText }}</a>
        </p>

        <KButton
          appearance="primary"
          class="login-button"
          data-testid="kong-auth-login-submit"
          :disabled="loginBtnDisabled"
          type="submit"
        >
          <KIcon
            v-if="['pending', 'success'].some(currentState.matches)"
            color="currentColor"
            icon="spinner"
            :size="KUI_ICON_SIZE_30"
          />
          {{ loginBtnText }}
        </KButton>

        <div v-if="showRegisterLink" class="register-link-wrapper">
          <p>
            <span data-testid="kong-auth-login-register-help-text">{{ registerLinkHelpText }} &nbsp;</span>
            <a
              data-testid="kong-auth-login-register-link"
              href="#"
              @click.prevent="$emit('click-register-link')"
            >{{ registerLinkText }}</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, reactive, ref, Ref, computed, onMounted, watch } from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import { AxiosResponse } from 'axios'
import { win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useIdentityProvider from '@/composables/useIdentityProvider'
import useI18n from '@/composables/useI18n'
import useAxios from '@/composables/useAxios'
import { loginEmits } from '@/components/emits'
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
// Components
import { KAlert, KButton, KIcon, KInput, KSkeleton } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(loginEmits)

const { userEntity, customErrorHandler, lang } = useConfigOptions()
const { messages } = useI18n(lang)

/**
 * Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value.
 * Do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
 *
 * The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the
 * custom element provide().
 */
const instructionText: Ref<string> = inject('instruction-text', ref(''))
const showForgotPasswordLink: Ref<boolean> = inject('show-forgot-password-link', ref(false))
const forgotPasswordLinkText: Ref<string> = inject('forgot-password-link-text', ref(messages.login.forgotPasswordLinkText))
const showRegisterLink: Ref<boolean> = inject('show-register-link', ref(false))
const registerLinkText: Ref<string> = inject('register-link-text', ref(messages.login.registerLinkText))
const registerLinkHelpText: Ref<string> = inject('register-link-help-text', ref(messages.login.registerLinkHelpText))
const registerSuccessText: Ref<string> = inject('register-success-text', ref(messages.login.registerSuccess))
const basicAuthLoginEnabled: Ref<boolean> = inject('basic-auth-login-enabled', ref(true))
const showBasicAuthLoginLink: Ref<boolean> = inject('show-basic-auth-login-link', ref(true))
const idpLoginEnabled: Ref<boolean> = inject('idp-login-enabled', ref(false))
const idpLoginReturnTo: Ref<string> = inject('idp-login-return-to', ref(''))

const formData = reactive({
  email: '',
  password: '',
})
const error = ref<any>(null)
const fieldsHaveError = ref(false)
const forceBasicAuth = ref(false)
const loginWithCredentialsLinkIsVisible = computed((): boolean => userEntity !== 'developer' && !basicAuthLoginEnabled.value && !forceBasicAuth.value && showBasicAuthLoginLink.value)
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
    predictableActionArguments: true,
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

// Allow forcing the login button to be enabled if the form was autofilled
const forceLoginBtnEnabled = ref<boolean>(false)
const loginBtnDisabled = computed((): boolean => !forceLoginBtnEnabled.value && ((!formData.email || !formData.password) || ['pending', 'success'].some(currentState.value.matches)))

const loginBtnSSODisabled = computed((): boolean => idpIsLoading.value || ['pending', 'success'].some(currentState.value.matches))

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

const { axiosInstance: axiosInstanceV1 } = useAxios({}, 'v1')

const verifyEmailAddress = async (token: string): Promise<void> => {
  try {
    send('VERIFY_EMAIL')

    // setTimeout for simulated feedback
    await new Promise((resolve) => setTimeout(resolve, 250))

    const verificationResponse: AxiosResponse = userEntity === 'developer' ? await axiosInstanceV1.post('/api/v2/developer/verify-email', { token }) : await axiosInstanceV1.patch('/api/v1/email-verifications', { token })

    send('RESOLVE')

    setUserStatusCookie()

    formData.email = verificationResponse.data.email || ''
    const resetToken = verificationResponse.data.resetToken || verificationResponse.data.token
    send('CONFIRMED_EMAIL')

    emit('verify-email-success', {
      email: formData.email,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetToken: resetToken || undefined,
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
      loginResponse = await axiosInstanceV1.post('/api/v2/developer/authenticate', {
        username: formData.email,
        password: formData.password,
      })
    } else {
      loginResponse = await axiosInstanceV1.post('/api/v1/authenticate', {
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

// Track the number of fields that have been autofilled
const autofillCount = ref<number>(0)

// On autofill, increment the autofillCount and enable the login button if the count is greater than one
const checkAutofill = (e: any): void => {
  if (e.animationName === 'onAutofillStart') {
    autofillCount.value++
    if (autofillCount.value > 1) {
      forceLoginBtnEnabled.value = true
    }
  } else if (e.animationName === 'onAutofillCancel') {
    forceLoginBtnEnabled.value = false
  }
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
    await verifyEmailAddress(token)
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
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
