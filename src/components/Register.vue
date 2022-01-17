<template>
  <div class="kong-auth-register-form">
    <div
      v-if="currentState.matches('error') && !passwordError && error"
      class="my-3"
      data-testid="kong-auth-register-alert"
    >
      <ErrorMessage :error="error" />
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="register-form"
      @submit.prevent="submitForm"
      novalidate
      data-testid="kong-auth-register-form"
    >
      <p
        v-if="instructionText"
        class="color-black-45"
        data-testid="kong-auth-register-instruction-text"
      >{{ instructionText }}</p>

      <div>
        <KLabel for="full_name">Full Name *</KLabel>
        <KInput
          id="full_name"
          v-model.trim="fullName"
          type="text"
          class="mb-4"
          autocomplete="name"
          :disabled="prepopulated"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !fullName ? true : false"
          required
          data-testid="kong-auth-register-full-name"
        />
      </div>

      <KLabel for="organization">Organization *</KLabel>
      <KInput
        id="organization"
        v-model.trim="organization"
        type="text"
        class="mb-4"
        autocomplete="organization"
        :disabled="prepopulated"
        :has-error="currentState.matches('error') && error && fieldsHaveError && !organization ? true : false"
        required
        data-testid="kong-auth-register-organization"
      />

      <KLabel for="email">Email *</KLabel>
      <KInput
        id="email"
        v-model.trim="email"
        type="email"
        class="mb-4"
        autocomplete="email"
        :disabled="prepopulated"
        :has-error="currentState.matches('error') && error && fieldsHaveError && !email ? true : false"
        required
        data-testid="kong-auth-register-email"
      />

      <KLabel for="password">Password *</KLabel>
      <KInput
        id="password"
        v-model.trim="password"
        type="password"
        class="mb-4"
        autocomplete="new-password"
        :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
        required
        data-testid="kong-auth-register-password"
      />

      <div v-if="!emailToken && accessCodeRequired">
        <KLabel for="access_code">Access Code *</KLabel>
        <KInput
          id="access_code"
          v-model="accessCode"
          class="mb-4"
          type="password"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !accessCode ? true : false"
          required
          data-testid="kong-auth-register-access-code"
        />
      </div>

      <div class="color-black-45 type-sm">
        <KCheckbox v-model="checked_agreement" data-testid="kong-auth-register-check-agreement">
          I agree to the
          <a
            href="https://konghq.com/konnectcustomeragreement"
            target="_blank"
          >Konnect customer agreement</a>
          and
          <a href="https://konghq.com/privacy" target="_blank">privacy policy</a>.
        </KCheckbox>
      </div>

      <div
        v-if="currentState.matches('error') && passwordError && error"
        data-testid="kong-auth-register-alert"
      >
        <ErrorMessage :error="error" />
      </div>

      <KButton
        type="submit"
        appearance="primary"
        :is-rounded="false"
        class="register-submit justify-content-center w-100 type-lg mt-6"
        :disabled="btnDisabled"
        data-testid="kong-auth-register-submit"
      >
        <KIcon
          v-if="currentState.matches('pending')"
          icon="spinner"
          size="16"
          color="white"
          view-box="0 0 16 16"
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
import { helpText } from '@/utils'
import KongAuthApi from '@/services/kauth-api-client/v1/KongAuthApi'
// Components
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import KLabel from '@kongponents/klabel'
import KCheckbox from '@kongponents/kcheckbox'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default defineComponent({
  name: 'Register',

  components: {
    KButton,
    KIcon,
    KInput,
    KLabel,
    KCheckbox,
    ErrorMessage,
  },

  emits: ['register-success'],

  setup(props, { emit }) {
    // Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value
    // The default values provided to inject() here should be refs with empty/false since the defaults are typically handled in the custom element provide()
    const instructionText: Ref<string> = inject('instruction-text', ref(''))

    const formData = reactive({
      email: '',
      fullName: '',
      emailToken: '',
      organization: '',
      prepopulated: false,
      accessCode: '',
      password: '',
      checked_agreement: false,
    })

    const accessCodeRequired = ref(false)
    const error = ref<any>(null)
    const passwordError = ref<boolean>(false)
    const fieldsHaveError = ref(false)
    const $api = new KongAuthApi()

    const { state: currentState, send } = useMachine(
      createMachine({
        id: 'AUTH_REGISTER',
        initial: 'idle',
        states: {
          idle: {
            on: { CLICK_REGISTER: 'pending' },
          },
          pending: {
            on: { RESOLVE: 'success', REJECT: 'error' },
          },
          error: {
            on: { CLICK_REGISTER: 'pending' },
          },
          success: {},
        },
      }),
    )

    const userCanSubmitForm = computed((): boolean => {
      return !!(formData.email &&
        formData.fullName &&
        formData.organization &&
        formData.password &&
        formData.checked_agreement &&
        (accessCodeRequired.value ? !formData.emailToken && formData.accessCode : true))
    })

    const btnText = computed((): string => {
      return ['pending', 'success'].some(currentState.value.matches) ? 'Submitting' : 'Sign up for Free'
    })

    const btnDisabled = computed((): boolean => {
      return currentState.value.matches('pending') || !userCanSubmitForm.value
    })

    const submitForm = async (): Promise<void> => {
      send('CLICK_REGISTER')

      // Reset form errors
      error.value = null
      passwordError.value = false
      fieldsHaveError.value = false

      if (!userCanSubmitForm.value) {
        send('REJECT')

        fieldsHaveError.value = true

        error.value = {
          status: null,
          statusText: helpText.general.missingInfo,
        }
        return
      }

      // setTimeout for simulated feedback
      await new Promise((resolve) => setTimeout(resolve, 250))

      try {
        if (formData.emailToken) {
          // Accept the invite and set the password
          await $api.inviteAccept.acceptInvite({
            password: formData.password,
            token: formData.emailToken,
          })
        } else {
          // Register a new user
          await $api.registration.register({
            email: formData.email,
            fullName: formData.fullName,
            organization: formData.organization,
            password: formData.password,
            registrationCode: accessCodeRequired.value && formData.accessCode ? formData.accessCode : undefined,
          })
        }

        send('RESOLVE')

        // Emit success
        emit('register-success', {
          email: formData.email,
          fromInvite: formData.prepopulated,
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

    const checkForAccessCodeRequirement = async (): Promise<void> => {
      try {
        // Check if access code is required
        const clientConfigResponse = await $api.clientConfig.clientConfig()
        accessCodeRequired.value = clientConfigResponse?.data?.requireRegistrationAccessCode === true
      } catch (_) {
        // Set to true to guard Registration
        accessCodeRequired.value = true
      }
    }

    onMounted(async () => {
      await checkForAccessCodeRequirement()

      const urlParams: URLSearchParams = new URLSearchParams(window.location.search)

      formData.emailToken = urlParams?.get('token') || ''
      formData.email = urlParams?.get('email') || ''
      formData.fullName = urlParams?.get('fullName') || ''
      formData.organization = urlParams?.get('org') || ''

      // If all values were passed in, set formData.prepopulated to true
      formData.prepopulated =
        !!(urlParams?.get('email') && urlParams?.get('token') && urlParams?.get('fullName') && urlParams?.get('org'))
    })

    return {
      currentState,
      btnText,
      btnDisabled,
      helpText,
      submitForm,
      error,
      passwordError,
      fieldsHaveError,
      accessCodeRequired,
      instructionText,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
.register-submit {
  --KButtonPrimaryBase: var(--green-400);

  &:hover:not(:disabled) {
    background-color: var(--green-300) !important;
  }
}
</style>
