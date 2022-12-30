<template>
  <div class="kong-auth-forgot-password-form">
    <div v-if="currentState.matches('error') && error" class="my-4">
      <ErrorMessage :error="error" />
    </div>
    <div v-else-if="currentState.matches('success')">
      <KAlert
        :alert-message="successText"
        appearance="info"
        class="mb-6"
        data-testid="kong-auth-forgot-password-success-message"
      />
      <KButton
        appearance="primary"
        class="justify-content-center w-100 type-lg"
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
        class="color-black-45"
        data-testid="kong-auth-forgot-password-instruction-text"
      >{{ instructionText }}</p>

      <KInput
        id="email"
        v-model.trim="formData.email"
        autocapitalize="off"
        autocomplete="username"
        class="w-100 mb-5"
        data-testid="kong-auth-forgot-password-email"
        :has-error="currentState.matches('error') && error ? true : false"
        :label="`${messages.inputLabels.email} *`"
        placeholder="Email"
        required
        type="email"
      />

      <KButton
        appearance="primary"
        class="justify-content-center w-100 type-lg"
        data-testid="kong-auth-forgot-password-submit"
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

    <div v-if="!currentState.matches('success') && showLoginLink" class="text-center mt-5">
      <p class="color-black-85 bold-500">
        <a
          class="color-blue-500"
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
import useKongAuthApi from '@/composables/useKongAuthApi'
import useI18n from '@/composables/useI18n'
import { AxiosResponse } from 'axios'
import { forgotPasswordEmits } from './emits'
// Components
import { KAlert, KButton, KIcon, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(forgotPasswordEmits)

const { customErrorHandler, lang } = useConfigOptions()
const { api } = useKongAuthApi()
const { messages } = useI18n(lang)

/**
 * Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value.
 * Do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
 *
 * The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the
 * custom element provide().
 */
const showLoginLink: Ref<boolean> = inject('show-login-link', ref(false))
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

const requestPasswordReset = async (): Promise<AxiosResponse<any>> => {
  // Custom endpoint
  if (resetPasswordRequestEndpoint.value) {
    return await api.client.post(resetPasswordRequestEndpoint.value, {
      data: {
        email: formData.email,
      },
    })
  }

  // Default endpoint
  return await api.passwords.requestUserPasswordReset({
    email: formData.email,
  })
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
