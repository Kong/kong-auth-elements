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
      @submit.prevent="processRecaptchaAndSubmit"
      novalidate
      data-testid="kong-auth-register-form"
    >
      <p
        v-if="instructionText"
        class="color-black-45"
        data-testid="kong-auth-register-instruction-text"
      >{{ instructionText }}</p>

      <div v-if="userEntity !== 'developer' && selectRegion">
        <KLabel for="regionInformationTitle" class="region-title">
          {{ `${messages.regionInformation.title} *` }}
        </KLabel>
        <p class="region-description">
          {{ messages.regionInformation.description }}
        </p>

        <div class="mb-4 kong-auth-register-region">
          <KSelect
            v-model="selectedRegionOption"
            id="regionInformationTitle"
            appearance="select"
            :items="regions"
            data-testid="kong-auth-register-region"
            autocomplete="konnect-region"
            @selected="(item: any) => handleItemSelect(selectedRegionOption, item)"
            />
        </div>
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
          class="w-100 mb-4"
          autocomplete="new-password"
          :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
          required
          data-testid="kong-auth-register-password"
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
        class="mt-4"
        v-if="currentState.matches('error') && passwordError && error"
        data-testid="kong-auth-register-alert"
      >
        <ErrorMessage :error="error" />
      </div>

      <vue-recaptcha
        v-if="recaptchaEnabled"
        ref="recaptcha"
        size="invisible"
        :sitekey="recaptchaSiteKey"
        @verify="onRecaptchaVerify"
        @expired="onRecaptchaExpired"
        @error="onRecaptchaError" />

      <KButton
        type="submit"
        appearance="primary"
        class="justify-content-center w-100 type-lg mt-6"
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
import { VueRecaptcha } from 'vue-recaptcha'
// Components
import { KButton, KIcon, KInput, KCheckbox, KSelect, KLabel } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const recaptchaSiteKey = '6LfG1fMhAAAAAIwjZEB4K2KW5IUGr1nNAIqMDkG_'

export const registerEmits = {
  'register-success': (payload: { email: string, organization: { id: string, name: string }}): boolean => {
    return !!payload?.email.trim() && !!payload?.organization?.id?.trim() && !!payload?.organization?.name?.trim()
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
    VueRecaptcha,
  },

  // Define emits with validation, where necessary
  emits: registerEmits,

  setup(props, { emit }) {
    const { userEntity, customErrorHandler, lang } = useConfigOptions()
    const { api } = useKongAuthApi()
    const { messages } = useI18n(lang)
    // ReCAPTCHA element ref
    const recaptcha = ref(null)
    const recaptchaVerified = ref(false)
    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const accessCodeRequired: Ref<boolean> = inject('access-code-required', ref(false)) // False by default so the backend can guard registration
    const recaptchaPropEnabled: Ref<boolean> = inject('recaptcha-enabled', ref(false)) // False by default so it can be enabled via prop
    const instructionText: Ref<string> = inject('instruction-text', ref(''))
    const registerButtonText: Ref<string> = inject('register-button-text', ref(messages.register.submitText))
    const registerRequestEndpoint: Ref<string> = inject('register-request-endpoint', ref(''))

    // Disable reCAPTCHA for Portal ('developer') implementations
    const recaptchaEnabled = computed((): boolean => userEntity !== 'developer' && recaptchaPropEnabled.value)

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
          defaultRegion: formData.selectedRegionOption,
        })
      }
    }

    const processRecaptchaAndSubmit = () => {
      try {
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

    const onRecaptchaVerify = () => {
      console.log('verified')

      recaptchaVerified.value = true

      submitForm()
    }

    const onRecaptchaError = () => {
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
      userEntity,
      ...toRefs(formData),
      regions,
      selectRegion,
      handleItemSelect,
      // ReCAPTCHA
      recaptcha,
      recaptchaEnabled,
      recaptchaSiteKey,
      processRecaptchaAndSubmit,
      onRecaptchaVerify,
      onRecaptchaError,
      onRecaptchaExpired,
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
