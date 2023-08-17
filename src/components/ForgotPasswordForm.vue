<template>
  <div class="kong-auth-forgot-password-form">
    <div v-if="currentState.matches('error') && error" class="form-error">
      <ErrorMessage :error="error" />
    </div>
    <div v-else-if="currentState.matches('success')">
      <KAlert
        :alert-message="successText"
        appearance="info"
        class="form-error"
        data-testid="kong-auth-forgot-password-success-message"
      />
      <KButton
        appearance="primary"
        class="forgot-password-return-to-login-btn"
        data-testid="kong-auth-forgot-password-return-to-login-btn"
        @click.prevent="$emit('click-login-link')"
      >{{ loginLinkText }}</KButton>
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="forgot-password-form"
      data-testid="kong-auth-forgot-password-form"
      novalidate
      @submit.prevent="submitForm"
    >
      <p
        v-if="instructionText"
        class="instruction-text"
        data-testid="kong-auth-forgot-password-instruction-text"
      >{{ instructionText }}</p>

      <KInput
        id="email"
        v-model.trim="formData.email"
        autocapitalize="off"
        autocomplete="username"
        class="kong-auth-input"
        data-testid="kong-auth-forgot-password-email"
        :has-error="currentState.matches('error') && error ? true : false"
        :label="`${messages.inputLabels.email}`"
        placeholder="Email"
        required
        type="email"
      />

      <KButton
        appearance="primary"
        class="forgot-password-submit"
        data-testid="kong-auth-forgot-password-submit"
        :disabled="btnDisabled"
        type="submit"
      >
        <ProgressIcon v-if="currentState.matches('pending')" class="spin-icon" :size="KUI_ICON_SIZE_40" />
        {{ btnText }}
      </KButton>
    </form>

    <div v-if="!currentState.matches('success') && showLoginLink" class="return-to-login-wrapper">
      <p>
        <a
          data-testid="kong-auth-forgot-password-return-to-login-link"
          href="#"
          @click.prevent="$emit('click-login-link')"
        >{{ loginLinkText }}</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, Ref, reactive, computed } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import useConfigOptions from '@/composables/useConfigOptions'
import useAxios from '@/composables/useAxios'
import useI18n from '@/composables/useI18n'
import { forgotPasswordEmits } from '@/components/emits'
import { AxiosResponse } from 'axios'
import { ProgressIcon } from '@kong/icons'
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
// Components
import { KAlert, KButton, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(forgotPasswordEmits)

const { customErrorHandler, lang } = useConfigOptions()
const { messages } = useI18n(lang)

/**
 * Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value.
 * Do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
 *
 * The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the
 * custom element provide().
 */
const showLoginLink: Ref<boolean> = inject('show-login-link', ref(false))
const wrapRequest: Ref<null | ((formData: any) => Record<string, any>)> = inject('wrap-request', ref(null))
const loginLinkText: Ref<string> = inject('login-link-text', ref(messages.forgotPassword.loginLinkText))
const instructionText: Ref<string> = inject('instruction-text', ref(''))
const successText: Ref<string> = inject('success-text', ref(messages.forgotPassword.success))
const resetPasswordRequestEndpoint: Ref<string> = inject('reset-password-request-endpoint', ref(''))

const formData = reactive({
  email: '',
})
const error = ref<any>(null)

const { state: currentState, send } = useMachine(
  createMachine({
    predictableActionArguments: true,
    id: 'AUTH_FORGOT_PASSWORD',
    initial: 'idle',
    states: {
      idle: {
        on: { CLICK_FORGOT_PASSWORD: 'pending' },
      },
      pending: {
        on: { RESOLVE: 'success', REJECT: 'error' },
      },
      error: {
        on: { CLICK_FORGOT_PASSWORD: 'pending' },
      },
      success: {},
    },
  }),
)

const btnText = computed(() => ['pending', 'success'].some(currentState.value.matches) ? messages.forgotPassword.submittingText : messages.forgotPassword.submitText)
const btnDisabled = computed(() => !formData.email || currentState.value.matches('pending'))

const { axiosInstance } = useAxios()
const { axiosInstance: axiosInstanceV1 } = useAxios({}, 'v1')

const requestPasswordReset = async (): Promise<AxiosResponse<any>> => {
  let body: any = formData

  if (wrapRequest.value) {
    body = wrapRequest.value(formData)
  } else {
    body = {
      email: formData.email,
    }
  }

  // Custom endpoint
  if (resetPasswordRequestEndpoint.value) {
    if (!wrapRequest.value) {
      // If there is no custom wrap function, it should be wrapped in a data
      // property by default.
      body = {
        data: body,
      }
    }

    // Use custom endpoint
    return await axiosInstance.post(resetPasswordRequestEndpoint.value, body)
  }

  return await axiosInstanceV1.post('/api/v1/password-resets', body)
}

const submitForm = async (): Promise<void> => {
  send('CLICK_FORGOT_PASSWORD')

  // Reset form error
  error.value = null

  if (!formData.email) {
    send('REJECT')

    error.value = {
      status: null,
      statusText: messages.forgotPassword.missingEmail,
    }
    return
  }

  // setTimeout for simulated feedback
  await new Promise((resolve) => setTimeout(resolve, 250))

  try {
    await requestPasswordReset()

    send('RESOLVE')

    // Emit success
    emit('forgot-password-success', {
      email: formData.email,
    })
  } catch (err: any) {
    send('REJECT')

    const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'reset-password-request', element: 'kong-auth-forgot-password' })

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
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
