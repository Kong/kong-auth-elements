<template>
  <BaseCustomElement>
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
          <KInput
            id="full_name"
            v-model.trim="fullName"
            type="text"
            label="Full Name *"
            class="mb-4"
            autocomplete="name"
            :disabled="prepopulated"
            :has-error="currentState.matches('error') && error && fieldsHaveError && !fullName ? true : false"
            required
            data-testid="kong-auth-register-full-name"
          />
        </div>

        <div v-if="userEntity !== 'developer'">
          <KInput
            id="organization"
            v-model.trim="organization"
            type="text"
            label="Organization *"
            class="mb-4"
            autocomplete="organization"
            :disabled="prepopulated"
            :has-error="currentState.matches('error') && error && fieldsHaveError && !organization ? true : false"
            required
            data-testid="kong-auth-register-organization"
          />
        </div>

        <KInput
          id="email"
          v-model.trim="email"
          type="email"
          label="Email *"
          class="mb-4"
          autocomplete="email"
          :disabled="prepopulated"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !email ? true : false"
          required
          data-testid="kong-auth-register-email"
        />

        <div v-if="userEntity !== 'developer'">
          <KInput
            id="password"
            v-model.trim="password"
            type="password"
            label="Password *"
            :class="[showPasswordStrengthMeter ? 'mb-0' : 'mb-4']"
            autocomplete="new-password"
            :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
            required
            data-testid="kong-auth-register-password"
          />

          <Password
            v-if="showPasswordStrengthMeter"
            class="password-strength-meter"
            v-model="password"
            :strength-meter-only="true"
          />
        </div>

        <div v-if="!emailToken && accessCodeRequired && userEntity !== 'developer'">
          <KInput
            id="access_code"
            v-model="accessCode"
            class="mb-4"
            type="password"
            label="Access Code *"
            :has-error="currentState.matches('error') && error && fieldsHaveError && !accessCode ? true : false"
            required
            data-testid="kong-auth-register-access-code"
          />
        </div>

        <div v-if="userEntity !== 'developer'" class="color-black-45 type-sm">
          <KCheckbox v-model="checked_agreement" data-testid="kong-auth-register-agree-checkbox">
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
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { helpText, win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useKongAuthApi from '@/composables/useKongAuthApi'
import { RegisterRegisterResponse } from '@kong/kauth-client-typescript-axios'
import { AxiosResponse } from 'axios'
// Components
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import KButton from '@kongponents/kbutton'
import KIcon from '@kongponents/kicon'
import KInput from '@kongponents/kinput'
import KCheckbox from '@kongponents/kcheckbox'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Password from 'vue-password-strength-meter'

export default defineComponent({
  name: 'KongAuthRegister',

  props: {
    accessCodeRequired: {
      type: Boolean,
      default: false,
    },
    instructionText: {
      type: String,
      default: '',
    },
    showPasswordStrengthMeter: {
      type: Boolean,
      default: false,
    },
    registerButtonText: {
      type: String,
      default: helpText.register.submitText,
    },
    registerRequestEndpoint: {
      type: String,
      default: '',
    },
  },

  components: {
    BaseCustomElement,
    ErrorMessage,
    KButton,
    KIcon,
    KInput,
    KCheckbox,
    Password,
  },

  // Define emits with validation, where necessary
  emits: {
    'register-success': (payload: { email: string, fromInvite: boolean }): boolean => {
      return !!payload?.email.trim() && typeof payload?.fromInvite === 'boolean'
    },
  },

  setup(props, { emit }) {
    const { userEntity, customErrorHandler } = useConfigOptions()
    const { api } = useKongAuthApi()

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

    const error = ref<any>(null)
    const passwordError = ref<boolean>(false)
    const fieldsHaveError = ref(false)

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
        // Organization and Password are not required for `developer` user entity
        ((formData.organization && formData.password && formData.checked_agreement) || userEntity === 'developer') &&
        // If they have an invite token, or filled out the access code, or are a developer
        (formData.emailToken || !props.accessCodeRequired || userEntity === 'developer' || (props.accessCodeRequired && formData.accessCode))
      )
    })

    const btnText = computed((): string => {
      return ['pending', 'success'].some(currentState.value.matches) ? helpText.register.submittingText : props.registerButtonText
    })

    const btnDisabled = computed((): boolean => {
      return currentState.value.matches('pending') || !userCanSubmitForm.value
    })

    const processRegistration = async (): Promise<AxiosResponse<RegisterRegisterResponse | any>> => {
      if (formData.emailToken) {
        // Accept the invite and set the password
        return await api.inviteAccept.acceptUserInvite({
          password: formData.password,
          token: formData.emailToken,
        })
      } else {
        // Register a new user

        if (props.registerRequestEndpoint) {
          // If custom endpoint (still passing all the values even though 'developer' only needs email and fullName)
          return await api.client.post(props.registerRequestEndpoint, {
            data: {
              email: formData.email,
              fullName: formData.fullName,
              organization: formData.organization || undefined,
              password: formData.password || undefined,
            },
          })
        } else {
          // default endpoint
          return await api.registration.registerUser({
            email: formData.email,
            fullName: formData.fullName,
            organization: formData.organization,
            password: formData.password,
            registrationCode: props.accessCodeRequired && formData.accessCode ? formData.accessCode : undefined,
          })
        }
      }
    }

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
        await processRegistration()

        send('RESOLVE')

        // Emit success
        emit('register-success', {
          email: formData.email,
          fromInvite: formData.prepopulated,
        })
      } catch (err: any) {
        send('REJECT')

        const customEndpointErrorMessage = props.registerRequestEndpoint && typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'register-request', element: 'kong-auth-register' })

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

    onMounted(async () => {
      const urlParams: URLSearchParams = new URLSearchParams(win.getLocationSearch())

      formData.emailToken = urlParams?.get('token') || ''
      formData.fullName = urlParams?.get('fullName') || ''
      formData.organization = urlParams?.get('org') || ''
      formData.email = urlParams?.get('email') || ''

      // If all values were passed in, set formData.prepopulated to true
      formData.prepopulated =
        !!(urlParams?.get('token') && urlParams?.get('fullName') && urlParams?.get('org') && urlParams?.get('email'))
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
      userEntity,
      ...toRefs(formData),
    }
  },
})
</script>

<style lang="scss">
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
