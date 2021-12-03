<template>
  <div
    class="kong-auth-forgot-password-form d-flex align-items-center justify-content-center flex-column">
    <div class="col-12">
      <div v-if="currentState.matches('error') && error" class="my-3">
        <ErrorMessage :error="error" />
      </div>
      <div v-else-if="currentState.matches('success')">
        <KAlert
          :alert-message="helpText.forgotPassword.success"
          appearance="info"
          class="mb-6" />
        <KButton
          class="justify-content-center w-100 type-lg"
          :to="loginUrl"
          appearance="primary">
          Return to Login
        </KButton>
      </div>

      <form
        v-if="!currentState.matches('success')"
        class="forgot-password-form"
        @submit.prevent="submitForm"
        novalidate>
        <p class="color-black-45">
          {{ helpText.forgotPassword.instructions }}
        </p>

        <KLabel for="email">Email</KLabel>
        <KInput
          id="email"
          v-model.trim="email"
          type="email"
          class="w-100 mb-5"
          autocomplete="email"
          :has-error="currentState.matches('error') && error"
          placeholder="Email"
          required
          autofocus />

        <KButton
          type="submit"
          appearance="primary"
          class="justify-content-center w-100 type-lg"
          :disabled="btnDisabled">
          <KIcon
            v-if="currentState.matches('pending')"
            icon="spinner"
            view-box="0 0 16 16"
            class="pr-0 mr-2" />
          {{ btnText }}
        </KButton>
      </form>

      <div
        v-if="!currentState.matches('success') && loginUrl"
        class="text-center mt-5">
        <p class="color-black-85 bold-500">
          <a class="color-blue-500" :href="loginUrl">
            Return to log in &rarr;
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, reactive, toRefs, computed } from 'vue'
import { createMachine } from 'xstate'
import { helpText } from '@/utils'
import { useMachine } from '@xstate/vue'
import { TrackCategory } from '@/analytics/analytics.constants'
import Api from '@/services/Api'
// Components
import KAlert from '@kongponents/kalert'
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import ErrorMessage from '@/components/ErrorMessage.vue'

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

  setup() {
    // Get custom element props
    const loginUrl = inject('login-url', '')

    const formData = reactive({
      email: '',
    })
    const error = ref<any>(null)
    const $api = new Api()

    const { state: currentState, send } = useMachine(
      createMachine({
        id: 'AUTH_LOGIN',
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
      return ['pending', 'success'].some(currentState.value.matches)
        ? 'Submitting'
        : 'Recover Password'
    })

    const btnDisabled = computed(() => {
      return !formData.email || currentState.value.matches('pending')
    })

    const submitForm = async () => {
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
        await $api.auth.passwords.passwordResetsPost({
          email: formData.email,
        })
        send('RESOLVE')
        // eslint-disable-next-line no-undef
        konnect.track('Sent password recovery email', {
          category: TrackCategory.Account,
        })
      } catch (err: any) {
        send('REJECT')

        if (err?.response) {
          error.value = err.response
        }
      }
    }

    return {
      loginUrl,
      currentState,
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

<style lang="scss">
/*! KONG_AUTH_INJECT_STYLES */
.kong-auth-forgot-password-form {
  position: relative;
  margin: 10px 0;
}
</style>
