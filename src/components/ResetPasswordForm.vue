<template>
  <div class="kong-auth-reset-password-form">
    <div v-if="currentState.matches('error') && error" class="form-error">
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
        class="instruction-text"
        data-testid="kong-auth-reset-password-instruction-text"
      >{{ instructionText }}</p>

      <!-- Hidden username input to assist password managers -->
      <input id="email" autocomplete="username" class="hidden-input" name="email" type="email" />

      <KInput
        id="password"
        v-model.trim="formData.password"
        autocomplete="new-password"
        class="kong-auth-input"
        data-testid="kong-auth-reset-password-new-password"
        :has-error="currentState.matches('error') && error ? true : false"
        :label="`${messages.inputLabels.newPassword}`"
        required
        type="password"
      />

      <KInput
        id="password-confirm"
        v-model.trim="formData.confirmPassword"
        autocomplete="new-password"
        class="kong-auth-input"
        data-testid="kong-auth-reset-password-confirm-new-password"
        :error-message="passwordIsInvalid ? messages.resetPassword.passwordMismatch : undefined"
        :has-error="(currentState.matches('error') && error) || passwordIsInvalid ? true : false"
        :label="`${messages.inputLabels.confirmPassword}`"
        required
        type="password"
      />

      <KButton
        appearance="primary"
        class="reset-password-submit"
        data-testid="kong-auth-reset-password-submit"
        :disabled="btnDisabled"
        type="submit"
      >
        <ProgressIcon v-if="currentState.matches('pending')" class="spin-icon" :size="KUI_ICON_SIZE_40" />
        {{ btnText }}
      </KButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, ref, reactive, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useAxios from '@/composables/useAxios'
import useI18n from '@/composables/useI18n'
import { resetPasswordEmits } from '@/components/emits'
import type { AxiosResponse } from 'axios'
import { ProgressIcon } from '@kong/icons'
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
// Components
import { KButton, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(resetPasswordEmits)

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

const passwordIsInvalid = computed((): boolean => formData.password !== formData.confirmPassword && formData.confirmPassword !== '')

const btnText = computed((): string => ['pending', 'success'].some(currentState.value.matches) ? messages.resetPassword.submittingText : messages.resetPassword.submitText)

const btnDisabled = computed((): boolean => {
  return (
    currentState.value.matches('pending') ||
        !formData.password ||
        !formData.confirmPassword ||
        passwordIsInvalid.value
  )
})

const { axiosInstance: axiosInstanceV1 } = useAxios({}, 'v1')

const resetPassword = async (credentials: {
  password: string,
  token: string,
}) => {
  if (userEntity === 'developer') {
    return await axiosInstanceV1.post('/api/v2/developer/reset-password', credentials)
  }

  return await axiosInstanceV1.patch('/api/v1/password-resets', credentials)
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
    const response: AxiosResponse = await resetPassword({
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
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
