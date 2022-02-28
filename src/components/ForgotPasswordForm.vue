<template>
  <div class="kong-auth-forgot-password-form">
    <div v-if="currentState.matches('error') && error" class="my-3">
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
        @click.prevent="$emit('click-login-link')"
        class="justify-content-center w-100 type-lg"
        appearance="primary"
        :is-rounded="false"
        data-testid="kong-auth-forgot-password-return-to-login-btn"
      >{{ loginLinkText }}</KButton>
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="forgot-password-form"
      @submit.prevent="submitForm"
      novalidate
      data-testid="kong-auth-forgot-password-form"
    >
      <p
        v-if="instructionText"
        class="color-black-45"
        data-testid="kong-auth-forgot-password-instruction-text"
      >{{ instructionText }}</p>

      <!-- Hidden username input to assist password managers -->
      <input type="hidden" autocomplete="username" id="email" name="email"/>

      <KLabel for="email">Email *</KLabel>
      <KInput
        id="email"
        v-model.trim="email"
        type="email"
        class="w-100 mb-5"
        autocomplete="username"
        autocapitalize="off"
        :has-error="currentState.matches('error') && error ? true : false"
        placeholder="Email"
        required
        data-testid="kong-auth-forgot-password-email"
      />

      <KButton
        type="submit"
        appearance="primary"
        :is-rounded="false"
        class="justify-content-center w-100 type-lg"
        :disabled="btnDisabled"
        data-testid="kong-auth-forgot-password-submit"
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

    <div v-if="!currentState.matches('success') && showLoginLink" class="text-center mt-5">
      <p class="color-black-85 bold-500">
        <a
          @click.prevent="$emit('click-login-link')"
          class="color-blue-500"
          href="#"
          data-testid="kong-auth-forgot-password-return-to-login-link"
        >{{ loginLinkText }}</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref, reactive, toRefs, computed } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { helpText } from '@/utils'
import useApi from '@/composables/useApi'
// Components
import KAlert from '@kongponents/kalert'
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import ErrorMessage from '@/components/ErrorMessage.vue'

export const forgotPasswordEmits = {
  'forgot-password-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
  'click-login-link': null,
}

export default defineComponent({
  name: 'ForgotPasswordForm',

  components: {
    KAlert,
    KButton,
    KIcon,
    KInput,
    KLabel,
    ErrorMessage,
  },

  // Define emits with validation, where necessary
  emits: forgotPasswordEmits,

  setup(props, { emit }) {
    // Get API instance and user entity type
    const { api, userEntity } = useApi()

    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.

    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const showLoginLink: Ref<boolean> = inject('show-login-link', ref(false))
    const loginLinkText: Ref<string> = inject('login-link-text', ref(''))
    const instructionText: Ref<string> = inject('instruction-text', ref(''))
    const successText: Ref<string> = inject('success-text', ref(''))
    const resetPasswordRequestEndpoint: Ref<string> = inject('reset-password-request-endpoint', ref(''))

    const formData = reactive({
      email: '',
    })
    const error = ref<any>(null)

    const { state: currentState, send } = useMachine(
      createMachine({
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

    const btnText = computed(() => {
      return ['pending', 'success'].some(currentState.value.matches) ? helpText.forgotPassword.submittingText : helpText.forgotPassword.submitText
    })

    const btnDisabled = computed(() => {
      return !formData.email || currentState.value.matches('pending')
    })

    const requestPasswordReset = async () => {
      // Custom endpoint
      if (resetPasswordRequestEndpoint.value) {
        return await api.client.post(resetPasswordRequestEndpoint.value, {
          data: {
            email: formData.email,
          },
        })
      }

      // Default endpoint
      return await api.passwords.requestPasswordReset({
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
          statusText: helpText.forgotPassword.missingEmail,
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

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    return {
      currentState,
      showLoginLink,
      loginLinkText,
      instructionText,
      successText,
      btnText,
      btnDisabled,
      helpText,
      submitForm,
      error,
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
