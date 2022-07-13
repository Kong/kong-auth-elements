<template>
  <div class="kong-auth-register-form">
    <div
      v-if="currentState.matches('error') && !passwordError && error"
      class="my-4"
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

      <div v-if="userEntity !== 'developer' && !!selectGeo">
        <KLabel for="geoInformationTitle" class="geo-title">
          {{ `${messages.geoInformation.title} *` }}
        </KLabel>
        <p class="geo-description">
          {{ messages.geoInformation.description }}
        </p>
      </div>

      <div
        v-if="userEntity !== 'developer' && !!selectGeo"
        class="mb-4 kong-auth-register-geolocation">
        <KSelect
          v-model="selectedGeoOption"
          id="geoInformationTitle"
          appearance="select"
          :items="geoLocation"
          data-testid="kong-auth-register-geolocation"
          @selected="(item) => handleItemSelect(selectedGeoOption, item)"
        >
          <template v-slot:item-template="{ item }">
            <div class="select-item-label">{{ item.regionLabel }}</div>
            <div class="select-item-desc">{{ item.description }}</div>
          </template>
        </KSelect>
      </div>

      <div>
        <KInput
          id="full_name"
          v-model.trim="fullName"
          type="text"
          :label="`${messages.inputLabels.fullName} *`"
          class="w-100 mb-4"
          autocomplete="name"
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
          :label="`${messages.inputLabels.organization} *`"
          class="w-100 mb-4"
          autocomplete="organization"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !organization ? true : false"
          required
          data-testid="kong-auth-register-organization"
        />
      </div>

      <KInput
        id="email"
        v-model.trim="email"
        type="email"
        :label="`${messages.inputLabels.email} *`"
        class="w-100 mb-4"
        autocomplete="email"
        :has-error="currentState.matches('error') && error && fieldsHaveError && !email ? true : false"
        required
        data-testid="kong-auth-register-email"
      />

      <div v-if="userEntity !== 'developer'">
        <KInput
          id="password"
          v-model.trim="password"
          type="password"
          :label="`${messages.inputLabels.password} *`"
          :class="['w-100', showPasswordStrengthMeter ? 'mb-0' : 'mb-4']"
          autocomplete="new-password"
          :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
          required
          data-testid="kong-auth-register-password"
        />

        <PasswordStrengthMeter
          v-if="showPasswordStrengthMeter"
          class="password-strength-meter"
          v-model="password"
          :strength-meter-only="true"
        />
      </div>

      <div v-if="accessCodeRequired && userEntity !== 'developer'">
        <KInput
          id="access_code"
          v-model="accessCode"
          class="w-100 mb-4"
          type="password"
         :label="`${messages.inputLabels.accessCode} *`"
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
          class="pr-0 mr-2"
          color="var(--grey-400)"
        />
        {{ btnText }}
      </KButton>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, reactive, Ref, toRefs, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import useConfigOptions from '@/composables/useConfigOptions'
import useKongAuthApi from '@/composables/useKongAuthApi'
import useI18n from '@/composables/useI18n'
import { RegisterRegisterResponse } from '@kong/kauth-client-typescript-axios'
import { AxiosResponse } from 'axios'
import { win } from '@/utils'
// Components
import { KButton, KIcon, KInput, KCheckbox, KSelect, KLabel } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter.vue'

export const registerEmits = {
  'register-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
}

export default defineComponent({
  name: 'RegisterForm',

  components: {
    ErrorMessage,
    KButton,
    KIcon,
    KInput,
    KLabel,
    KCheckbox,
    KSelect,
    PasswordStrengthMeter,
  },

  // Define emits with validation, where necessary
  emits: registerEmits,

  setup(props, { emit }) {
    const { userEntity, customErrorHandler, lang } = useConfigOptions()
    const { api } = useKongAuthApi()
    const { messages } = useI18n(lang)
    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const accessCodeRequired: Ref<boolean> = inject('access-code-required', ref(false)) // False by default so the backend can guard registration
    const instructionText: Ref<string> = inject('instruction-text', ref(''))
    const showPasswordStrengthMeter: Ref<boolean> = inject('show-password-strength-meter', ref(false))
    const registerButtonText: Ref<string> = inject('register-button-text', ref(messages.register.submitText))
    const registerRequestEndpoint: Ref<string> = inject('register-request-endpoint', ref(''))

    const formData = reactive({
      email: '',
      selectedGeoOption: '',
      fullName: '',
      organization: '',
      accessCode: '',
      password: '',
      checked_agreement: false,
    })

    const error = ref<any>(null)
    const passwordError = ref<boolean>(false)
    const fieldsHaveError = ref(false)
    const geoLocation = [
      {
        label: `${messages.geos.us.label} (${messages.geos.us.desc}) `,
        description: messages.geos.us.desc,
        geoLabel: messages.geos.us.label,
        value: 'us',
        selected: true,
      },
      {
        label: `${messages.geos.eu.label} (${messages.geos.eu.desc}) `,
        description: messages.geos.eu.desc,
        geoLabel: messages.geos.eu.label,
        value: 'eu',
      },
    ]
    const selectGeo = ref('')

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

    const handleItemSelect = (field: any, item: { value: any }): void => {
      field = item.value
    }

    const userCanSubmitForm = computed((): boolean => {
      return !!(formData.email &&
        formData.fullName &&
        // Organization and Password are not required for `developer` user entity
        ((formData.organization && formData.password && formData.checked_agreement) || userEntity === 'developer') &&
        // If they filled out the access code, or are a developer
        (!accessCodeRequired.value || userEntity === 'developer' || (accessCodeRequired.value && formData.accessCode))
      )
    })

    const btnText = computed((): string => {
      return ['pending', 'success'].some(currentState.value.matches) ? messages.register.submittingText : registerButtonText.value
    })

    const btnDisabled = computed((): boolean => {
      return currentState.value.matches('pending') || !userCanSubmitForm.value
    })

    const processRegistration = async (): Promise<AxiosResponse<RegisterRegisterResponse>> => {
      // Register a new user
      if (registerRequestEndpoint.value) {
        // If custom endpoint (still passing all the values even though 'developer' only needs email and fullName)
        return await api.client.post(registerRequestEndpoint.value, {
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
          registrationCode: accessCodeRequired.value && formData.accessCode ? formData.accessCode : undefined,
          // TODO: commented out for now until the API client supports it
          // defaultGeo: formData.selectedGeoOption,
        })
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
          statusText: messages.general.missingInfo,
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
        })
      } catch (err: any) {
        send('REJECT')

        const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'register-request', element: 'kong-auth-register' })

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
      selectRegion.value = urlParams?.get('selectRegion') || ''
    })

    return {
      currentState,
      btnText,
      btnDisabled,
      messages,
      submitForm,
      error,
      passwordError,
      fieldsHaveError,
      accessCodeRequired,
      instructionText,
      showPasswordStrengthMeter,
      userEntity,
      ...toRefs(formData),
      geoLocation,
      selectGeo,
      handleItemSelect,
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
