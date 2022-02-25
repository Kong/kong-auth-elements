<template>
  <div class="kong-auth-reset-password-form">
    <div v-if="currentState.matches('error') && !passwordError && error" class="my-3">
      <ErrorMessage :error="error" />
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="reset-password-form"
      @submit.prevent="submitForm"
      novalidate
      data-testid="kong-auth-reset-password-form"
    >
      <p
        v-if="instructionText"
        class="color-black-45"
        data-testid="kong-auth-reset-password-instruction-text"
      >{{ instructionText }}</p>

      <!-- Hidden username input to assist password managers -->
      <input type="hidden" autocomplete="username" id="email" name="email"/>

      <KLabel for="password">New Password *</KLabel>
      <KInput
        id="password"
        v-model.trim="password"
        type="password"
        :class="[showPasswordStrengthMeter ? 'mb-0' : 'mb-4']"
        autocomplete="new-password"
        :has-error="currentState.matches('error') && error ? true : false"
        required
        data-testid="kong-auth-reset-password-new-password"
      />

      <Password
        v-if="showPasswordStrengthMeter"
        class="password-strength-meter mb-4"
        v-model="password"
        :strength-meter-only="true"
      />

      <KLabel for="password">Confirm New Password *</KLabel>
      <KInput
        id="password-confirm"
        v-model.trim="confirmPassword"
        type="password"
        class="mb-4"
        autocomplete="new-password"
        :has-error="(currentState.matches('error') && error) || passwordIsInvalid ? true : false"
        :error-message="passwordIsInvalid ? helpText.resetPassword.passwordMismatch : null"
        required
        data-testid="kong-auth-reset-password-confirm-new-password"
      />

      <div
        v-if="currentState.matches('error') && passwordError && error"
        data-testid="kong-auth-reset-password-alert"
        class="my-3"
      >
        <ErrorMessage :error="error" />
      </div>

      <KButton
        type="submit"
        appearance="primary"
        :is-rounded="false"
        class="justify-content-center w-100 type-lg"
        :disabled="btnDisabled"
        data-testid="kong-auth-reset-password-submit"
      >
        <KIcon
          v-if="currentState.matches('pending')"
          icon="spinner"
          view-box="0 0 16 16"
          class="pr-0 mr-2"
        />
        {{ btnText }}
      </KButton>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, Ref, inject, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { helpText, win, UserEntity } from '@/utils'
import useApi from '@/composables/useApi'
import { RestpwutilResetResponse, PasswordresetsResetRequest } from '@kong/kauth-client-typescript-axios'
import { AxiosResponse } from 'axios'
// Components
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Password from 'vue-password-strength-meter'

export const resetPasswordEmits = {
  'reset-password-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
}

export default defineComponent({
  name: 'ResetPassword',

  components: {
    KButton,
    KIcon,
    KInput,
    KLabel,
    ErrorMessage,
    Password,
  },

  // Define emits with validation, where necessary
  emits: resetPasswordEmits,

  setup(props, { emit }) {
    // Get API instance and user entity type
    const { api, userEntity } = useApi()

    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent *.ce.vue file props as they will not remain reactive.

    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const instructionText: Ref<string> = inject('instruction-text', ref(''))
    const showPasswordStrengthMeter: Ref<boolean> = inject('show-password-strength-meter', ref(false))

    const formData = reactive({
      email: '',
      passwordToken: '',
      password: '',
      confirmPassword: '',
    })

    const error = ref<any>(null)
    const passwordError = ref<boolean>(false)

    const { state: currentState, send } = useMachine(
      createMachine({
        id: 'AUTH_RESET_PASSWORD',
        initial: 'idle',
        states: {
          idle: {
            on: { CLICK_RESET_PASSWORD: 'pending' },
          },
          pending: {
            on: { RESOLVE: 'success', REJECT: 'error' },
          },
          error: {
            on: { CLICK_RESET_PASSWORD: 'pending' },
          },
          success: {},
        },
      }),
    )

    const passwordIsInvalid = computed(
      () => formData.password !== formData.confirmPassword && formData.confirmPassword !== '',
    )

    const btnText = computed((): string => {
      return ['pending', 'success'].some(currentState.value.matches) ? helpText.resetPassword.submittingText : helpText.resetPassword.submitText
    })

    const btnDisabled = computed((): boolean => {
      return (
        currentState.value.matches('pending') ||
        !formData.password ||
        !formData.confirmPassword ||
        passwordIsInvalid.value
      )
    })

    const resetPassword = async (credentials: PasswordresetsResetRequest) => {
      if (userEntity === UserEntity.DEVELOPER) {
        return await api.developers.resetDevelopersPassword(credentials)
      }

      return await api.passwords.resetUserPassword(credentials)
    }

    const submitForm = async (): Promise<void> => {
      send('CLICK_RESET_PASSWORD')

      // Reset form errors
      error.value = null
      passwordError.value = false

      // If either password field is empty
      if (!formData.password || !formData.confirmPassword) {
        send('REJECT')

        error.value = {
          status: null,
          statusText: helpText.general.missingInfo,
        }
        return
      }

      // If passwords do not match
      if (passwordIsInvalid.value) {
        send('REJECT')

        error.value = {
          status: null,
          statusText: helpText.resetPassword.passwordMismatch,
        }
        return
      }

      // setTimeout for simulated feedback
      await new Promise((resolve) => setTimeout(resolve, 250))

      try {
        const response: AxiosResponse<RestpwutilResetResponse> = await resetPassword({
          password: formData.password,
          token: formData.passwordToken,
        })

        formData.email = response.data?.email || formData.email || ''

        send('RESOLVE')

        // Emit success
        emit('reset-password-success', {
          email: formData.email,
        })
      } catch (err: any) {
        send('REJECT')

        if (err?.response) {
          const response = err.response
          const errors = response.data?.errors

          error.value = response

          if (errors?.length) {
            const firstError = errors[0]

            if (firstError?.detail?.includes('password')) {
              passwordError.value = true
            }
          }
        }
      }
    }

    onMounted(() => {
      const urlParams: URLSearchParams = new URLSearchParams(win.getLocationSearch())

      formData.email = urlParams?.get('email') || ''
      formData.passwordToken = urlParams?.get('token') || ''
    })

    return {
      currentState,
      btnText,
      btnDisabled,
      helpText,
      instructionText,
      showPasswordStrengthMeter,
      passwordIsInvalid,
      submitForm,
      error,
      passwordError,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
.password-strength-meter {
  max-width: none;
}
</style>
