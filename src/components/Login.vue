<template>
  <div class="kong-auth-login-form">
    <div class="d-flex align-items-center justify-content-center flex-column">
      <div class="col-12">
        <div v-if="currentState.matches('error') && error" class="my-3">
          <ErrorMessage :error="error" />
        </div>

        <form class="login-form" @submit.prevent="submitForm" novalidate>
          <KLabel for="email">Email</KLabel>
          <KInput
            id="email"
            v-model.trim="email"
            type="email"
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

          <p v-if="showForgotPasswordLink" class="help mt-3">
            <a
              @click.prevent="$emit('click-forgot-password-link')"
              class="color-blue-500"
              href="#"
              >{{ forgotPasswordLinkText }}</a
            >
          </p>

          <KButton
            type="submit"
            appearance="primary"
            class="justify-content-center w-100 type-lg"
            :class="[showForgotPasswordLink ? 'mt-3' : 'mt-6']"
            :disabled="btnDisabled"
            >{{ btnText }}</KButton
          >

          <div v-if="showRegisterLink" class="text-center mt-5">
            <p class="color-black-85 bold-500">
              {{ registerHelpText }}
              <a
                @click.prevent="$emit('click-register-link')"
                class="color-blue-500"
                href="#"
                >{{ registerLinkText }}</a
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed } from 'vue'
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'
import { helpText } from '@/utils'
import Api from '@/services/Api'
import { AuthenticateAuthenticateRequest } from '@/services/kauth-api-client'
import { TrackCategory } from '@/analytics/analytics.constants'
// Components
import KButton from '@kongponents/kbutton'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default defineComponent({
  name: 'Login',

  emits: ['click-forgot-password-link', 'click-register-link', 'login-success'],

  components: {
    KButton,
    KInput,
    KLabel,
    ErrorMessage,
  },

  setup(props, { emit }) {
    // Get custom element props
    const showForgotPasswordLink: boolean = inject(
      'show-forgot-password-link',
      false,
    )
    const forgotPasswordText: string = inject('forgot-password-link-text', '')
    const forgotPasswordLinkText = ref(
      forgotPasswordText
        ? forgotPasswordText
        : helpText.login.forgotPasswordLinkText,
    )

    const showRegisterLink: boolean = inject('show-register-link', false)
    const registerText: string = inject('register-link-text', '')
    const registerLinkText = ref(
      registerText ? registerText : helpText.login.registerLinkText,
    )
    const registerHelp: string = inject('register-help-text', '')
    const registerHelpText = ref(
      registerHelp ? registerHelp : helpText.login.registerHelpText,
    )

    const formData = reactive({
      email: '',
      password: '',
      message: '', // Being set, but not used?
    })
    const error = ref<any>(null)
    const $api = new Api()

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

    const btnText = computed(() => {
      return ['pending', 'success'].some(currentState.value.matches)
        ? 'Submitting'
        : 'Login'
    })

    const btnDisabled = computed(() => {
      return (
        !formData.email ||
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

      if (!formData.email || !formData.password) {
        send('REJECT')

        error.value = {
          status: 401,
        }

        formData.message = helpText.login.unauthenticated // not being used
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
          emit('login-success')
        }
        send('REJECT')
        if (response.status === 403) {
          formData.message = helpText.login.accountLocked // not being used

          return
        }

        formData.message = helpText.login.unauthenticated // not being used
      } catch (err: any) {
        send('REJECT')

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    return {
      showForgotPasswordLink,
      forgotPasswordLinkText,
      showRegisterLink,
      registerHelpText,
      registerLinkText,
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
