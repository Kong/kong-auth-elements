<template>
  <div class="kong-auth-register-form d-flex align-items-center justify-content-center flex-column">
    <div class="col-12">
      <div
        v-if="currentState.matches('error') && !passwordError && error"
        class="my-3"
        data-testid="kong-auth-register-alert">
        <ErrorMessage :error="error" />
      </div>

      <form v-if="!currentState.matches('success')" class="register-form" @submit.prevent="submitForm" novalidate>
        <div class="name-container">
          <div class="name-field">
            <KLabel for="first_name">First Name *</KLabel>
            <KInput
              id="first_name"
              v-model.trim="firstName"
              type="text"
              class="mb-4"
              autocomplete="given-name"
              :disabled="prepopulated"
              :has-error="currentState.matches('error') && error ? true : false"
              required
              data-testid="kong-auth-register-first-name" />
          </div>
          <div class="name-field">
            <KLabel for="last_name">Last Name *</KLabel>
            <KInput
              id="last_name"
              v-model.trim="lastName"
              type="text"
              class="mb-4"
              autocomplete="family-name"
              :disabled="prepopulated"
              :has-error="currentState.matches('error') && error ? true : false"
              required
              data-testid="kong-auth-register-last-name" />
          </div>
        </div>

        <KLabel for="organization">Organization *</KLabel>
        <KInput
          id="organization"
          v-model.trim="organization"
          type="text"
          class="mb-4"
          autocomplete="organization"
          :disabled="prepopulated"
          :has-error="currentState.matches('error') && error ? true : false"
          required
          data-testid="kong-auth-register-organization" />

        <input v-if="emailToken" id="emailToken" :value="emailToken" type="hidden" name="emailToken" />

        <KLabel for="email">Email *</KLabel>
        <KInput
          id="email"
          v-model.trim="email"
          type="email"
          class="mb-4"
          autocomplete="email"
          :disabled="prepopulated"
          :has-error="currentState.matches('error') && error ? true : false"
          required
          data-testid="kong-auth-register-email" />

        <KLabel for="password">Password *</KLabel>
        <KInput
          id="password"
          v-model.trim="password"
          type="password"
          class="mb-4"
          autocomplete="new-password"
          :has-error="currentState.matches('error') && error ? true : false"
          required
          data-testid="kong-auth-register-password" />

        <div v-if="!emailToken && accessCodeRequired">
          <KLabel for="access_code">Access Code *</KLabel>
          <KInput
            id="access_code"
            v-model="accessCode"
            class="mb-4"
            type="password"
            required
            data-testid="kong-auth-register-access-code" />
        </div>

        <div class="color-black-45 type-sm">
          <KCheckbox v-model="checked_agreement" data-testid="kong-auth-register-check-agreement">
            I agree to the
            <a href="https://konghq.com/konnectcustomeragreement" target="_blank">Konnect customer agreement</a>
            and <a href="https://konghq.com/privacy" target="_blank">privacy policy</a>.
          </KCheckbox>
        </div>

        <div v-if="currentState.matches('error') && passwordError && error" data-testid="kong-auth-register-alert">
          <ErrorMessage :error="error" />
        </div>

        <KButton
          type="submit"
          appearance="primary"
          class="register-submit justify-content-center w-100 type-lg mt-6"
          :disabled="btnDisabled"
          data-testid="kong-auth-register-submit">
          <KIcon icon="spinner" size="16" color="white" view-box="0 0 16 16" class="pr-0 mr-2" />
          {{ btnText }}
        </KButton>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, reactive, toRefs, computed } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { helpText } from '@/utils'
import Api from '@/services/Api'
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
    const propFormData: any = inject('register-form-data')

    const formData = reactive({
      email: propFormData.email,
      firstName: propFormData.firstName,
      lastName: propFormData.lastName,
      emailToken: propFormData.emailToken,
      organization: propFormData.organization,
      prepopulated: propFormData.prepopulated,
      password: '',
      accessCode: '',
      checked_agreement: false,
    })

    const error = ref<any>(null)
    const passwordError = ref<boolean>(false)
    const $api = new Api()

    const { state: currentState, send } = useMachine(
      createMachine({
        id: 'AUTH_LOGIN',
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

    const btnText = computed(() => {
      return ['pending', 'success'].some(currentState.value.matches) ? 'Submitting' : 'Sign up for Free'
    })

    const btnDisabled = computed(() => {
      const formDataValues = [
        formData.firstName,
        formData.lastName,
        formData.organization,
        formData.email,
        formData.password,
      ]

      function formDataValuesLength(element: any) {
        return element.length
      }

      return (
        currentState.value.matches('pending') ||
        !formDataValues.every(formDataValuesLength) ||
        !formData.checked_agreement
      )
    })

    const accessCodeRequired = ref<boolean>(false)

    const submitForm = async () => {
      send('CLICK_REGISTER')

      // Reset form errors
      error.value = null
      passwordError.value = false

      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.organization ||
        !formData.password
      ) {
        send('REJECT')

        error.value = {
          status: null,
          statusText: helpText.register.missingInfo,
        }
        return
      }

      // setTimeout for simulated feedback
      await new Promise((resolve) => setTimeout(resolve, 250))

      try {
        await $api.auth.registration.registerPost({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          organization: formData.organization,
          password: formData.password,
        })

        send('RESOLVE')

        // Emit success
        emit('register-success', {
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

    return {
      currentState,
      btnText,
      btnDisabled,
      helpText,
      submitForm,
      error,
      passwordError,
      accessCodeRequired,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
.kong-auth-register-form {
  position: relative;
  margin: 10px 0;

  .name-container {
    @media screen and (min-width: 768px) {
      display: flex;

      .name-field {
        flex: 1;

        &:first-of-type {
          margin-right: 20px;
        }
      }
    }
  }
}

.register-submit {
  --KButtonPrimaryBase: var(--green-400);

  &:hover:not(:disabled) {
    background-color: var(--green-300);
  }
}
</style>
