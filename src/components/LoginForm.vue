<template>
  <div class="kong-auth-login-form">
    <KSkeleton
      v-if="currentState.matches('from_url')"
      type="fullscreen-kong"
      :delay-milliseconds="0"
      data-testid="global-walking-gruce" />
    <div
      v-else
      class="d-flex align-items-center justify-content-center flex-column">
      <div class="col-10 col-md-6">
        <div v-if="currentState.matches('error') && error" class="my-3">
          <ErrorMessage :error="error" />
        </div>

        <form class="login-form" @submit.prevent="submitForm">
          <KLabel for="email">Email</KLabel>
          <KInput
            id="email"
            v-model.trim="username"
            class="w-100 mb-5"
            autocomplete="email"
            :has-error="currentState.matches('error') && error"
            required
            autofocus />

          <KLabel for="password">Password</KLabel>
          <KInput
            id="password"
            v-model="password"
            type="password"
            class="w-100"
            autocomplete="current-password"
            :has-error="currentState.matches('error') && error"
            required />

          <p v-if="forgotPasswordUrl" class="help my-3">
            <a class="color-blue-500" :href="forgotPasswordUrl">
              Forgot your password?
            </a>
          </p>

          <KButton
            type="submit"
            appearance="primary"
            class="justify-content-center w-100 type-lg"
            :disabled="btnDisabled"
            >{{ btnText }}</KButton
          >
        </form>

        <div v-if="registerUrl" class="text-center mt-5">
          <p class="color-black-85 bold-500">
            Don't have an account?
            <a class="color-blue-500" :href="registerUrl"> Sign Up &rarr; </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  reactive,
  ref,
  toRefs,
  computed,
  onMounted,
} from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import Api from '@/services/Api'
import { AuthenticateAuthenticateRequest } from '@/services/kauth-api-client'
import { TrackCategory } from '@/analytics/analytics.constants'
// Components
import KButton from '@kongponents/kbutton'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import KSkeleton from '@kongponents/kskeleton/KSkeleton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default defineComponent({
  name: 'LoginForm',

  components: {
    KButton,
    KInput,
    KLabel,
    KSkeleton,
    ErrorMessage,
  },

  setup() {
    // Get custom element props
    const forgotPasswordUrl = inject('forgot-password-url', '')
    const registerUrl = inject('register-url', '')

    const formData = reactive({
      username: '',
      password: '',
      email: '',
      message: '',
    })
    const $api = new Api()
    const error = ref(null)

    const helpText = {
      login: {
        unauthenticated: 'Incorrect username or password. Please try again.',
        accountLocked:
          'Your account has been locked. Reset your password to log in now',
      },
    }

    const {
      state: currentState,
      send,
      service,
    } = useMachine(
      createMachine({
        id: 'AUTH_LOGIN',
        initial: 'idle',
        states: {
          idle: {
            on: {
              FROM_INVITE: 'from_invite',
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
          from_invite: {
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
      return ['pending', 'success'].some(currentState.value.matches)
        ? 'Submitting'
        : 'Login'
    })

    const btnDisabled = computed(() => {
      return (
        !formData.username ||
        !formData.password ||
        ['pending', 'success'].some(currentState.value.matches)
      )
    })

    const login = async (credentials: AuthenticateAuthenticateRequest) => {
      return await $api.auth.authentication.authenticatePost(credentials)
    }

    const submitForm = async () => {
      send('SUBMIT_LOGIN')

      // Reset form error
      error.value = null
      formData.message = ''

      // setTimeout for simulated feedback
      await new Promise((resolve) => setTimeout(resolve, 250))

      try {
        const response = await login({
          username: formData.username,
          password: formData.password,
        })

        if (response.status >= 200 && response.status < 300) {
          // redirect to Konnect or referal URL
          window.location.href = '/'
        }
        send('REJECT')
        if (response.status === 403) {
          formData.message = helpText.login.accountLocked

          return
        }

        formData.message = helpText.login.unauthenticated
      } catch (e: any) {
        send('REJECT')

        if (e?.response) {
          error.value = e.response
        }
      }
    }

    const setEmail = async (token: string) => {
      let response
      try {
        response = await $api.auth.emailVerification.emailVerificationsPatch({
          token,
        })
        send('RESOLVE')
        setUserStatusCookie()
        formData.username = response.data.email
        // eslint-disable-next-line no-undef
        konnect.track('Confirmed Email', { category: TrackCategory.Account })
        send('CONFIRMED_EMAIL')
      } catch (err: any) {
        send('REJECT')
        formData.message = Array.isArray(err.message)
          ? err.message.join('. ')
          : err.message
      }
    }

    const setUserStatusCookie = async () => {
      // return domain if valid, empty string if not a valid domain (like localhost)
      const getDomain = () => {
        const hostname = window.location.hostname

        return hostname.indexOf('.') > -1
          ? `domain=${hostname.substring(
              hostname.lastIndexOf('.', hostname.lastIndexOf('.') - 1) + 1,
            )};`
          : ''
      }
      const date = new Date()

      // Set expiration date to two months from current date
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 60)
      document.cookie = `userStatus=active; path=/; ${getDomain()} expires=${date.toUTCString()};`
    }

    const paramCheck = (param: string | string[]) => {
      return Array.isArray(param) ? param.toString() : param
    }

    onMounted(async () => {
      // const route = useRoute()

      const urlParams = new URLSearchParams(window.location.search)
      // const emailInRouteParams = paramCheck(route.params.email)
      // const passwordReset = paramCheck(route.params.passwordReset)
      const tokenInQueryParams = urlParams.get('token')

      // if (passwordReset) send('RESET_PASSWORD')

      // if (emailInRouteParams) {
      //   formData.username = emailInRouteParams
      //   setUserStatusCookie()
      //   send('FROM_INVITE')

      //   return
      // }

      if (tokenInQueryParams) return setEmail(tokenInQueryParams)
    })

    return {
      forgotPasswordUrl,
      registerUrl,
      btnText,
      btnDisabled,
      currentState,
      submitForm,
      error,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss">
/*! KONG_AUTH_INJECT_STYLES */
.kong-auth-login-form {
  position: relative;
  margin: 10px 0;

  .fullscreen-loading-container {
    position: absolute;
  }
}
</style>
