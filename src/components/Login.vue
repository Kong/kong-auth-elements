<template>
  <KSkeleton
    v-if="currentState.matches('from_url')"
    class="idp-loading"
    type="fullscreen-kong"
    :delay-milliseconds="0"
    data-testid="global-walking-gruce" />

  <div v-else class="kong-auth-login-form">
    <div v-if="currentState.matches('error') && error" class="my-3">
      <ErrorMessage :error="error" />
    </div>

    <div v-else-if="currentState.matches('reset_password')" class="my-3">
      <KAlert
        :alert-message="helpText.login.passwordResetSuccess"
        appearance="success"
        class="justify-content-center" />
    </div>

    <div v-else-if="currentState.matches('confirmed_email')" class="my-3">
      <KAlert
        :alert-message="helpText.login.confirmedEmailSuccess"
        appearance="success"
        class="justify-content-center" />
    </div>

    <div v-else-if="currentState.matches('from_register')" class="my-3">
      <KAlert :alert-message="helpText.login.registerSuccess" appearance="success" class="justify-content-center" />
    </div>

    <form class="login-form" @submit.prevent="submitForm" novalidate data-testid="kong-auth-login-form">
      <div v-if="!isIdpLogin">
        <KLabel for="email">Email *</KLabel>
        <KInput
          id="email"
          v-model.trim="email"
          type="email"
          class="w-100 mb-5"
          autocomplete="email"
          :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
          required
          autofocus
          data-testid="kong-auth-login-email" />

        <KLabel for="password">Password *</KLabel>
        <KInput
          id="password"
          v-model="password"
          type="password"
          class="w-100"
          autocomplete="current-password"
          :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
          required
          data-testid="kong-auth-login-password" />

        <p v-if="showForgotPasswordLink" class="help mt-3">
          <a
            @click.prevent="$emit('click-forgot-password-link')"
            class="color-blue-500"
            href="#"
            data-testid="kong-auth-login-forgot-password-link"
            >{{ forgotPasswordLinkText }}</a
          >
        </p>
      </div>

      <KButton
        type="submit"
        appearance="primary"
        :is-rounded="false"
        class="justify-content-center w-100 type-lg"
        :class="[showForgotPasswordLink ? 'mt-3' : 'mt-6']"
        :disabled="btnDisabled"
        data-testid="kong-auth-login-submit">
        <KIcon v-if="currentState.matches('pending')" icon="spinner" view-box="0 0 16 16" class="pr-0 mr-2" />
        {{ btnText }}
      </KButton>

      <p v-if="isIdpLogin" class="help mt-3 text-center">
        <a
          @click.prevent="loginWithCredentials"
          class="color-blue-500"
          href="#"
          data-testid="kong-auth-login-credentials-link"
          >{{ helpText.login.loginWithCredentials }}</a
        >
      </p>

      <div v-if="showRegisterLink" class="text-center mt-5">
        <p class="color-black-85 bold-500">
          {{ registerLinkHelpText }}
          <a
            @click.prevent="$emit('click-register-link')"
            class="color-blue-500"
            href="#"
            data-testid="kong-auth-login-register-link"
            >{{ registerLinkText }}</a
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, Ref, toRefs, computed, onMounted, watch } from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import KongAuthApi from '@/services/kauth-api-client/v1/KongAuthApi'
import { AuthenticateAuthenticateRequest, EmailverificationsVerifyResponse, NotARealResponse } from '@/services/kauth-api-client/v1/api'
import { AxiosResponse } from 'axios'
import { helpText } from '@/utils'
import useIdentityProvider from '@/composables/useIdentityProvider'
// Components
import KAlert from '@kongponents/kalert'
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import { KSkeleton } from '@kongponents/kskeleton'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default defineComponent({
  name: 'Login',

  emits: [
    'login-success',
    'confirm-email-success',
    'click-forgot-password-link',
    'click-register-link',
    'idp-is-loading',
  ],

  components: {
    KAlert,
    KButton,
    KIcon,
    KInput,
    KLabel,
    KSkeleton,
    ErrorMessage,
  },

  setup(props, { emit }) {
    // Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value
    // The default values provided to inject() here should be refs with empty/false since the defaults are typically handled in the custom element provide()
    const showForgotPasswordLink: Ref<boolean> = inject('show-forgot-password-link', ref(false))
    const forgotPasswordLinkText: Ref<string> = inject('forgot-password-link-text', ref(''))
    const showRegisterLink: Ref<boolean> = inject('show-register-link', ref(false))
    const registerLinkText: Ref<string> = inject('register-link-text', ref(''))
    const registerLinkHelpText: Ref<string> = inject('register-link-help-text', ref(''))
    const idpLoginEnabled: Ref<boolean> = inject('idp-login-enabled', ref(false))
    const idpLoginReturnTo: Ref<string> = inject('idp-login-return-to', ref(''))

    const formData = reactive({
      email: '',
      password: '',
    })
    const error = ref<any>(null)
    const fieldsHaveError = ref(false)
    const $api = new KongAuthApi()

    // Setup and automatically trigger IDP (or ignore it, depending on the props)
    // Passing the refs on purpose so values are reactive.
    const { isIdpLogin, idpIsLoading } = useIdentityProvider(idpLoginEnabled, idpLoginReturnTo)

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

    const btnText = computed(() => {
      return ['pending', 'success'].some(currentState.value.matches) ? 'Submitting' : 'Login'
    })

    const btnDisabled = computed(() => {
      return (
        ((!formData.email || !formData.password) && !isIdpLogin.value) ||
        ['pending', 'success'].some(currentState.value.matches)
      )
    })

    const setUserStatusCookie = async () => {
      // return domain if valid, empty string if not a valid domain (like localhost)
      const getDomain = () => {
        const hostname = window.location.hostname

        return hostname.indexOf('.') > -1
          ? `domain=${hostname.substring(hostname.lastIndexOf('.', hostname.lastIndexOf('.') - 1) + 1)};`
          : ''
      }
      const date = new Date()

      // Set expiration date to two months from current date
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 60)
      document.cookie = `userStatus=active; path=/; ${getDomain()} expires=${date.toUTCString()};`
    }

    const verifyEmailAddress = async (token: string): Promise<void> => {
      try {
        const response: AxiosResponse<EmailverificationsVerifyResponse> = await $api.emailVerification.verifyEmail({
          token,
        })

        console.log('emailVerification', response.data)

        send('RESOLVE')

        setUserStatusCookie()

        formData.email = response.data.email
        send('CONFIRMED_EMAIL')

        emit('confirm-email-success', {
          email: formData.email,
        })
      } catch (err: any) {
        send('REJECT')

        fieldsHaveError.value = false

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    const login = async (credentials: AuthenticateAuthenticateRequest) => {
      return await $api.authentication.authenticate(credentials)
    }

    const submitForm = async (): Promise<void> => {
      // If IdP login form
      if (isIdpLogin.value) {
        try {
          // Get current href
          const loginUrl = new URL(window.location.href)
          // Remove the logout query param
          loginUrl.searchParams.delete('logout')
          // Redirect the user back to the page without the logout which should initialize IdP login
          window.location.href = loginUrl.href
          return
        } catch (_) {
          // If the above fails, just redirect them to the same page without any params
          window.location.href = window.location.origin + window.location.pathname
          return
        }
      }

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
        const response = await login({
          username: formData.email,
          password: formData.password,
        })

        if (response.status >= 200 && response.status < 300) {
          send('RESOLVE')
          emit('login-success')
          return
        }

        send('REJECT')
        fieldsHaveError.value = true

        if (response.status === 403) {
          return
        }
      } catch (err: any) {
        send('REJECT')

        fieldsHaveError.value = true

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    const loginWithCredentials = (): void => {
      // Redirect the user to the same login page without anything else in the path
      window.location.href = window.location.origin + '/login'
    }

    onMounted(async () => {
      // Get URL params
      const urlParams = new URLSearchParams(window.location.search)

      // If token in URL params
      const token = urlParams.get('token')
      if (token) {
        // Verify email address and set email on success
        await verifyEmailAddress(token)
        return
      }

      // Set email if in route params
      const emailInParams = urlParams.get('email')
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
      showForgotPasswordLink,
      forgotPasswordLinkText,
      showRegisterLink,
      helpText,
      registerLinkHelpText,
      registerLinkText,
      btnText,
      btnDisabled,
      currentState,
      submitForm,
      loginWithCredentials,
      error,
      fieldsHaveError,
      isIdpLogin,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
.idp-loading {
  justify-content: center;
}

.text-center {
  text-align: center;
}
</style>
