<template>
  <div class="kong-auth-reset-password-form">
    <div v-if="currentState.matches('error') && error" class="my-4">
      <ErrorMessage :error="error" />
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="reset-password-form"
      data-testid="kong-auth-reset-password-form"
      novalidate
      @submit.prevent="submitForm"
    >
      <p
        v-if="instructionText"
        class="color-black-45"
        data-testid="kong-auth-reset-password-instruction-text"
      >{{ instructionText }}</p>

      <!-- Hidden username input to assist password managers -->
      <input id="email" autocomplete="username" name="email" type="hidden" />

      <KInput
        id="password"
        v-model.trim="password"
        autocomplete="new-password"
        class="w-100 mb-4"
        data-testid="kong-auth-reset-password-new-password"
        :has-error="currentState.matches('error') && error ? true : false"
        :label="`${messages.inputLabels.newPassword} *`"
        required
        type="password"
      />

      <KInput
        id="password-confirm"
        v-model.trim="confirmPassword"
        autocomplete="new-password"
        class="w-100 mb-4"
        data-testid="kong-auth-reset-password-confirm-new-password"
        :error-message="passwordIsInvalid ? messages.resetPassword.passwordMismatch : undefined"
        :has-error="(currentState.matches('error') && error) || passwordIsInvalid ? true : false"
        :label="`${messages.inputLabels.confirmPassword} *`"
        required
        type="password"
      />

      <KButton
        appearance="primary"
        class="justify-content-center w-100 type-lg"
        data-testid="kong-auth-reset-password-submit"
        :disabled="btnDisabled"
        type="submit"
      >
        <KIcon
          v-if="currentState.matches('pending')"
          class="pr-0 mr-2"
          color="var(--grey-400)"
          icon="spinner"
          size="16"
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
  },

  // Define emits with validation, where necessary
  emits: resetPasswordEmits,

  setup(props, { emit }) {
    const { userEntity, customErrorHandler, lang } = useConfigOptions()
    const { api } = useKongAuthApi()
    const { messages } = useI18n(lang)

    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const instructionText: Ref<string> = inject('instruction-text', ref(''))

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
        predictableActionArguments: true,
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