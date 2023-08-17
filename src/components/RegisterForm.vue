<template>
  <div class="kong-auth-register-form">
    <div
      v-if="currentState.matches('error') && !passwordError && error"
      class="form-error"
      data-testid="kong-auth-register-alert"
    >
      <ErrorMessage :error="error" />
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="register-form"
      data-testid="kong-auth-register-form"
      novalidate
      @submit.prevent="processRecaptchaAndSubmit"
    >
      <p
        v-if="instructionText"
        class="instruction-text"
        data-testid="kong-auth-register-instruction-text"
      >{{ instructionText }}</p>

      <div v-if="userEntity !== 'developer' && selectRegion">
        <KLabel class="region-title" for="regionInformationTitle">
          {{ `${messages.regionInformation.title} *` }}
        </KLabel>
        <p class="region-description">
          {{ messages.regionInformation.description }}
        </p>

        <div class="kong-auth-register-region">
          <KSelect
            id="regionInformationTitle"
            v-model="formData.selectedRegionOption"
            appearance="select"
            autocomplete="konnect-region"
            data-testid="kong-auth-register-region"
            :items="regions"
            @selected="(item: any) => handleItemSelect(formData.selectedRegionOption, item)"
            />
        </div>
      </div>

      <div>
        <KInput
          id="full_name"
          v-model.trim="formData.fullName"
          autocomplete="name"
          class="kong-auth-input"
          data-testid="kong-auth-register-full-name"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !formData.fullName ? true : false"
          :label="`${messages.inputLabels.fullName}`"
          required
          type="text"
        />
      </div>

      <div v-if="userEntity !== 'developer'">
        <KInput
          id="organization"
          v-model.trim="formData.organization"
          autocomplete="organization"
          class="kong-auth-input"
          data-testid="kong-auth-register-organization"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !formData.organization ? true : false"
          :label="`${messages.inputLabels.organization}`"
          required
          type="text"
        />
      </div>

      <KInput
        id="email"
        v-model.trim="formData.email"
        autocomplete="email"
        class="kong-auth-input"
        data-testid="kong-auth-register-email"
        :has-error="currentState.matches('error') && error && fieldsHaveError && !formData.email ? true : false"
        :label="`${messages.inputLabels.email}`"
        required
        type="email"
      />

      <div v-if="userEntity !== 'developer'">
        <KInput
          id="password"
          v-model.trim="formData.password"
          autocomplete="new-password"
          class="kong-auth-input"
          data-testid="kong-auth-register-password"
          :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
          :label="`${messages.inputLabels.password}`"
          required
          type="password"
        />
      </div>

      <div v-if="accessCodeRequired && userEntity !== 'developer'">
        <KInput
          id="access_code"
          v-model="formData.accessCode"
          autocomplete="off"
          class="kong-auth-input"
          data-testid="kong-auth-register-access-code"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !formData.accessCode ? true : false"
          :label="`${messages.inputLabels.accessCode}`"
          required
          type="password"
        />
      </div>

      <div v-if="userEntity !== 'developer'" class="checkbox-instruction-text">
        <KCheckbox v-model="formData.checked_agreement" data-testid="kong-auth-register-agree-checkbox">
          <span>
            I agree to the
            <a
              href="https://konghq.com/konnectcustomeragreement"
              target="_blank"
            >Konnect customer agreement</a>
            and
            <a href="https://konghq.com/privacy" target="_blank">privacy policy</a>.
          </span>
        </KCheckbox>
      </div>

      <div
        v-if="currentState.matches('error') && passwordError && error"
        class="kong-auth-register-alert"
        data-testid="kong-auth-register-alert"
      >
        <ErrorMessage :error="error" />
      </div>

      <vue-recaptcha
        v-if="recaptchaEnabled"
        ref="recaptcha"
        recaptcha-script-id="kong-auth-elements-recaptcha"
        :sitekey="recaptchaSiteKey"
        size="invisible"
        @error="onRecaptchaError"
        @expired="onRecaptchaExpired"
        @verify="onRecaptchaVerify" />

      <KButton
        appearance="primary"
        class="register-submit"
        data-testid="kong-auth-register-submit"
        :disabled="btnDisabled"
        type="submit"
      >
        <ProgressIcon v-if="currentState.matches('pending')" class="spin-icon" :size="KUI_ICON_SIZE_40" />
        {{ btnText }}
      </KButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, reactive, Ref, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import useConfigOptions from '@/composables/useConfigOptions'
import useAxios from '@/composables/useAxios'
import useI18n from '@/composables/useI18n'
import { registerEmits } from '@/components/emits'
import { AxiosResponse } from 'axios'
import { win } from '@/utils'
import { VueRecaptcha } from 'vue-recaptcha'
import { ProgressIcon } from '@kong/icons'
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
// Components
import { KButton, KInput, KCheckbox, KSelect, KLabel } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(registerEmits)

const { userEntity, customErrorHandler, lang } = useConfigOptions()
const { messages } = useI18n(lang)
// ReCAPTCHA element ref
const recaptcha = ref(null)
const recaptchaVerified = ref(false)
const recaptchaSiteKey = '6LfG1fMhAAAAAIwjZEB4K2KW5IUGr1nNAIqMDkG_'

/**
 * Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value.
 * Do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
 *
 * The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the
 * custom element provide().
 */
const accessCodeRequiredProp: Ref<boolean> = inject('access-code-required', ref(false)) // False by default so the backend can guard registration
const recaptchaPropEnabled: Ref<boolean> = inject('recaptcha-enabled', ref(false)) // False by default so it can be enabled via prop
const wrapRequest: Ref<null | ((formData: any) => Record<string, any>)> = inject('wrap-request', ref(null))
const instructionText: Ref<string> = inject('instruction-text', ref(''))
const registerButtonText: Ref<string> = inject('register-button-text', ref(messages.register.submitText))
const registerRequestEndpoint: Ref<string> = inject('register-request-endpoint', ref(''))

// Ensure is not set to true on production
const accessCodeRequired = computed((): boolean => accessCodeRequiredProp.value && [true, 'true'].includes(accessCodeRequiredProp.value))

// Disable reCAPTCHA for Portal ('developer') implementations
const recaptchaEnabled = computed((): boolean => userEntity !== 'developer' && recaptchaPropEnabled.value && [true, 'true'].includes(recaptchaPropEnabled.value))

const regions = [
  {
    label: `${messages.geos.us.label} (${messages.geos.us.desc}) `,
    description: messages.geos.us.desc,
    regionLabel: messages.geos.us.label,
    value: 'us',
    selected: true,
  },
  {
    label: `${messages.geos.eu.label} (${messages.geos.eu.desc}) `,
    description: messages.geos.eu.desc,
    regionLabel: messages.geos.eu.label,
    value: 'eu',
  },
]

const formData = reactive({
  email: '',
  selectedRegionOption: regions[0].value,
  fullName: '',
  organization: '',
  accessCode: '',
  password: '',
  checked_agreement: false,
})

const error = ref<any>(null)
const passwordError = ref<boolean>(false)
const fieldsHaveError = ref(false)
const selectRegion = ref(false)

const { state: currentState, send } = useMachine(
  createMachine({
    predictableActionArguments: true,
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

const btnText = computed((): string => ['pending', 'success'].some(currentState.value.matches) ? messages.register.submittingText : registerButtonText.value)

const btnDisabled = computed((): boolean => currentState.value.matches('pending') || !userCanSubmitForm.value)

const { axiosInstance } = useAxios()
const { axiosInstance: axiosInstanceV1 } = useAxios({}, 'v1')

const processRegistration = async (): Promise<AxiosResponse> => {
  let body: any = {
    email: formData.email,
    fullName: formData.fullName,
    organization: formData.organization,
    password: formData.password,
    registrationCode: accessCodeRequired.value && formData.accessCode ? formData.accessCode : undefined,
    defaultRegion: formData.selectedRegionOption,
  }

  if (wrapRequest.value) {
    body = wrapRequest.value(body)
  }

  // The registration endpoint for developers don't need these fields
  if (userEntity === 'developer') {
    delete body.organization
    delete body.password
    delete body.defaultRegion
  }

  // Register a new user
  if (registerRequestEndpoint.value) {
    if (!wrapRequest.value) {
      body = {
        data: body,
      }
    }
    // If custom endpoint (still passing all the values even though 'developer' only needs email and fullName)
    return await axiosInstance.post(registerRequestEndpoint.value, body)
  } else {
    // default endpoint
    return await axiosInstanceV1.post('/api/v1/register', body)
  }
}

const processRecaptchaAndSubmit = () => {
  try {
    // If reCAPTCHA is enabled and not verified, try verifying, otherwise submit
    if (recaptchaEnabled.value && !recaptchaVerified.value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      recaptcha.value?.execute()
    } else {
      submitForm()
    }
  } catch (err) {
    // Fallback to just submitting the form
    submitForm(true)
  }
}

// Set the variable to allow submission
const onRecaptchaVerify = () => {
  recaptchaVerified.value = true

  submitForm()
}

const onRecaptchaError = () => {
  recaptchaVerified.value = false

  error.value = {
    status: null,
    statusText: messages.general.recaptchaError,
  }
}

const onRecaptchaExpired = () => {
  recaptchaVerified.value = false
}

const submitForm = async (forceSkipRecaptcha = false): Promise<void> => {
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

  // If reCAPTCHA is enabled, and we aren't forcing to skip it because of error, and the user isn't verified, reject the submission
  if (recaptchaEnabled.value && !forceSkipRecaptcha && !recaptchaVerified.value) {
    send('REJECT')

    error.value = {
      status: null,
      statusText: messages.general.recaptchaError,
    }

    return
  }

  // setTimeout for simulated feedback
  await new Promise((resolve) => setTimeout(resolve, 250))

  try {
    const { data: { organizationID } } = await processRegistration()

    send('RESOLVE')

    // Emit success
    emit('register-success', {
      email: formData.email,
      organization: {
        id: organizationID || '',
        name: formData.organization || '',
      },
    })
  } catch (err: any) {
    send('REJECT')

    if (recaptchaEnabled.value) {
      // Must reset recaptcha for the next form submit
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // recaptcha.value?.reset()
    }

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
  selectRegion.value = !!urlParams?.get('selectRegion') && urlParams?.get('selectRegion') === 'true'
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
