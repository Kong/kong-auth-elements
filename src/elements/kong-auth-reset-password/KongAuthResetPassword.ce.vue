<template>
  <BaseCustomElement>
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
        <input type="hidden" autocomplete="username" id="email" name="email"/>

        <KInput
          id="password"
          v-model.trim="password"
          type="password"
          label="New Password *"
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

        <KInput
          id="password-confirm"
          v-model.trim="confirmPassword"
          type="password"
          label="Confirm New Password *"
          class="mb-4"
          autocomplete="new-password"
          :has-error="(currentState.matches('error') && error) || passwordIsInvalid ? true : false"
          :error-message="passwordIsInvalid ? helpText.resetPassword.passwordMismatch : null"
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
            view-box="0 0 16 16"
            class="pr-0 mr-2"
          />
          {{ btnText }}
        </KButton>
      </form>
    </div>
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, Ref, inject, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { helpText, win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useKongAuthApi from '@/composables/useKongAuthApi'
import { PasswordresetsResetRequest, PasswordAPIV1ResetResponse } from '@kong/kauth-client-typescript-axios'
import { AxiosResponse } from 'axios'
// Components
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Password from 'vue-password-strength-meter'

export default defineComponent({
  name: 'KongAuthResetPassword',

  props: {
    instructionText: {
      type: String,
      default: '',
    },
    showPasswordStrengthMeter: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    BaseCustomElement,
    ErrorMessage,
    KButton,
    KIcon,
    KInput,
    Password,
  },

  // Define emits with validation, where necessary
  emits: {
    'reset-password-success': (payload: { email: string }): boolean => {
      return !!payload?.email.trim()
    },
  },

  setup(props, { emit }) {
    const { userEntity } = useConfigOptions()
    const { api } = useKongAuthApi()

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
