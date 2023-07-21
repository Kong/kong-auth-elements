<template>
  <div class="kong-auth-change-password-form">
    <form
      v-if="!currentState.matches('success')"
      class="change-password-form"
      data-testid="kong-auth-change-password-form"
      novalidate
      @submit.prevent="submitForm"
    >
      <p
        v-if="instructionText"
        class="instruction-text"
        data-testid="kong-auth-change-password-instruction-text"
      >{{ instructionText }}</p>

      <!-- Hidden username input to assist password managers -->
      <input id="email" autocomplete="username" class="hidden-input" name="email" type="email" />

      <KInput
        id="current-password"
        ref="currentPassword"
        v-model.trim="formData.currentPassword"
        autocomplete="current-password"
        class="kong-auth-input"
        data-testid="kong-auth-change-password-current-password"
        :has-error="currentState.matches('error') && error ? true : false"
        :label="`${convertToTitleCase(messages.inputLabels.currentPassword)}`"
        :placeholder="messages.inputLabels.currentPasswordPlaceholder"
        required
        type="password"
      />

      <KInput
        id="new-password"
        ref="newPassword"
        v-model.trim="formData.newPassword"
        autocomplete="new-password"
        class="kong-auth-input"
        data-testid="kong-auth-change-password-new-password"
        :has-error="currentState.matches('error') && error ? true : false"
        :label="`${convertToTitleCase(messages.inputLabels.newPassword)}`"
        :placeholder="messages.inputLabels.newPasswordPlaceholder"
        required
        type="password"
      />

      <KInput
        id="password-confirm"
        ref="passwordConfirm"
        v-model.trim="formData.confirmPassword"
        autocomplete="new-password"
        class="kong-auth-input"
        data-testid="kong-auth-change-password-confirm-new-password"
        :error-message="passwordIsInvalid ? messages.resetPassword.passwordMismatch : undefined"
        :has-error="(currentState.matches('error') && error) || passwordIsInvalid ? true : false"
        :label="`${convertToTitleCase(messages.inputLabels.confirmPassword)}`"
        :placeholder="messages.inputLabels.confirmPasswordPlaceholder"
        required
        type="password"
      />

      <div v-if="currentState.matches('error') && error" class="form-error">
        <ErrorMessage :error="error" />
      </div>

      <div class="action-buttons">
        <KButton
          id="change-password-cancel"
          ref="changePasswordCancel"
          appearance="outline"
          data-testid="kong-auth-change-password-cancel"
          :disabled="btnDisabled"
          @click.prevent="handleCancel"
        >
          {{ messages.changePassword.cancelText }}
        </KButton>

        <KButton
          id="change-password-submit"
          ref="changePasswordSubmit"
          appearance="primary"
          data-testid="kong-auth-change-password-submit"
          :disabled="btnDisabled"
          type="submit"
        >
          <KIcon
            v-if="currentState.matches('pending')"
            color="currentColor"
            icon="spinner"
            :size="KUI_ICON_SIZE_30"
          />
          {{ btnText }}
        </KButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, Ref, reactive, computed, watch } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import useConfigOptions from '@/composables/useConfigOptions'
import useI18n from '@/composables/useI18n'
import useAxios from '@/composables/useAxios'
import { changePasswordEmits } from '@/components/emits'
import { convertToTitleCase } from '../utils/index'
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
// Components
import { KButton, KIcon, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(changePasswordEmits)

const { customErrorHandler, lang } = useConfigOptions()
const { messages } = useI18n(lang)

/**
 * Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value.
 * Do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
 *
 * The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the
 * custom element provide().
 */
const instructionText: Ref<string> = inject('instruction-text', ref(''))
const changePasswordButtonText: Ref<string> = inject('change-password-button-text', ref(messages.changePassword.submitText))

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const atLeast1UpperCaseRegex = /(?=.*[A-Z])/
const atLeast1LowerCaseRegex = /(?=.*[a-z])/
const atLeast1NumberRegex = /(?=.*\d)/
const atLeast1SpecialCharRegex = /(?=.*\W)/

const passwordRequirementsMet = {
  // on password-requirements event firing, return object of booleans to indicate which password requirements are met
  uppercase: computed((): boolean => atLeast1UpperCaseRegex.test(formData.newPassword)),
  lowercase: computed((): boolean => atLeast1LowerCaseRegex.test(formData.newPassword)),
  number: computed((): boolean => atLeast1NumberRegex.test(formData.newPassword)),
  special: computed((): boolean => atLeast1SpecialCharRegex.test(formData.newPassword)),
}

// a password is considered valid if it meets at least 3 out of the above 4 password requirements
const arePasswordRequirementsMet = computed((): boolean => Object.values(passwordRequirementsMet).filter(requirement => requirement.value === true).length >= 3)

// password must be at least 8 characters long and no more than 128 characters long
const isPasswordRequiredLength = computed((): boolean => formData.newPassword.length >= 8 && formData.newPassword.length <= 128)

const error = ref<any>(null)
const passwordError = ref<boolean>(false)

const { state: currentState, send } = useMachine(
  createMachine({
    predictableActionArguments: true,
    id: 'AUTH_CHANGE_PASSWORD',
    initial: 'idle',
    states: {
      idle: {
        on: { CLICK_CHANGE_PASSWORD: 'pending' },
      },
      pending: {
        on: { RESOLVE: 'success', REJECT: 'error' },
      },
      error: {
        on: { CLICK_CHANGE_PASSWORD: 'pending' },
      },
      success: {},
    },
  }),
)

const passwordIsInvalid = computed((): boolean => formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '')

const btnText = computed((): string => ['pending', 'success'].some(currentState.value.matches) ? messages.resetPassword.submittingText : changePasswordButtonText.value)

const btnDisabled = computed((): boolean => {
  return (
    currentState.value.matches('pending') ||
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword ||
      passwordIsInvalid.value ||
      !arePasswordRequirementsMet.value ||
      !isPasswordRequiredLength.value
  )
})

const handleCancel = (): void => {
  formData.currentPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
}

watch(() => formData.newPassword, () => {
  const passwordRequirementsEventData = Object.entries(passwordRequirementsMet).reduce((accumulator: any, currentValue) => {
    accumulator[currentValue[0]] = currentValue[1].value
    return accumulator
  }, {})
  emit('password-requirements', passwordRequirementsEventData)
})

const { axiosInstance } = useAxios()

const submitForm = async (): Promise<void> => {
  send('CLICK_CHANGE_PASSWORD')

  // Reset form errors
  error.value = null
  passwordError.value = false

  // If either password field is empty
  if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
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
    const response = await axiosInstance.patch('/v2/users/me/password', {
      old_password: formData.currentPassword,
      new_password: formData.newPassword,
    })

    if (response.status !== 202) {
      send('REJECT')

      error.value = {
        status: response.status,
        statusText: error,
      }
      return
    }
    send('RESOLVE')

    // Emit success
    emit('change-password-success')
  } catch (err: any) {
    send('REJECT')

    const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'set-new-password-request', element: 'kong-auth-change-password' })

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
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
