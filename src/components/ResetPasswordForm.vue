<template>
  <div class="kong-auth-reset-password-form">
    <div v-if="currentState.matches('error') && error" class="my-3">
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
      <input type="hidden" autocomplete="username" id="email" name="email" />

      <KInput
        id="password"
        v-model.trim="password"
        type="password"
        label="New Password *"
        :class="['w-100', showPasswordStrengthMeter ? 'mb-0' : 'mb-4']"
        autocomplete="new-password"
        :has-error="currentState.matches('error') && error ? true : false"
        required
        data-testid="kong-auth-reset-password-new-password"
      />

      <PasswordStrengthMeter
        v-if="showPasswordStrengthMeter"
        class="password-strength-meter mb-4"
        :model-value="password"
        :strength-meter-only="true"
      />

      <KInput
        id="password-confirm"
        v-model.trim="confirmPassword"
        type="password"
        label="Confirm New Password *"
        class="w-100 mb-4"
        autocomplete="new-password"
        :has-error="(currentState.matches('error') && error) || passwordIsInvalid ? true : false"
        :error-message="passwordIsInvalid ? messages.resetPassword.passwordMismatch : undefined"
        required
        data-testid="kong-auth-reset-password-confirm-new-password"
      />

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
          size="16"
          class="pr-0 mr-2"
        />
        {{ btnText }}
      </KButton>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref, reactive, toRefs, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useKongAuthApi from '@/composables/useKongAuthApi'
import useI18n from '@/composables/useI18n'
import { PasswordresetsResetRequest, PasswordAPIV1ResetResponse } from '@kong/kauth-client-typescript-axios'
import { AxiosResponse } from 'axios'
// Components
import { KButton, KIcon, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter.vue'

export const resetPasswordEmits = {
  'reset-password-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
}

export default defineComponent({
  name: 'ResetPasswordForm',

  components: {
    ErrorMessage,
    KButton,
    KIcon,
    KInput,
    PasswordStrengthMeter,
  },

  // Define emits with validation, where necessary
  emits: resetPasswordEmits,

  setup(props, { emit }) {
    const { userEntity, customErrorHandler } = useConfigOptions()
    const { api } = useKongAuthApi()
    const { messages } = useI18n()

    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
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
      return ['pending', 'success'].some(currentState.value.matches) ? messages.resetPassword.submittingText : messages.resetPassword.submitText
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
      if (userEntity === 'developer') {
        return await api.passwords.resetDeveloperPassword(credentials)
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
          statusText: messages.general.missingInfo,
        }
        return
      }

      // If passwords do not match
      if (passwordIsInvalid.value) {
        send('REJECT')

        error.value = {
          status: null,
          statusText: messages.resetPassword.passwordMismatch,
        }
        return
      }

      // setTimeout for simulated feedback
      await new Promise((resolve) => setTimeout(resolve, 250))

      try {
        const response: AxiosResponse<PasswordAPIV1ResetResponse> = await resetPassword({
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

        const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'set-new-password-request', element: 'kong-auth-reset-password' })

        if (customEndpointErrorMessage) {
          error.value = {
            status: undefined,
            statusText: customEndpointErrorMessage,
          }
          return
        }

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
      messages,
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
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
