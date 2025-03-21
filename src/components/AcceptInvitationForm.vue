<template>
  <div class="kong-auth-accept-invitation-form">
    <h2
      v-if="!currentState.matches('success') && formData.organization"
      class="accept-invitation-subheader"
      data-testid="kong-auth-accept-invitation-subheader"
    >
      <span data-testid="kong-auth-accept-invitation-subheader-text">{{ subheaderText }}</span> <span data-testid="kong-auth-accept-invitation-org-name">{{ formData.organization }}</span>!
    </h2>

    <div
      v-if="currentState.matches('error') && !passwordError && error"
      class="invitation-form-error"
      data-testid="kong-auth-accept-invitation-alert"
    >
      <ErrorMessage :error="error" />
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="accept-invitation-form"
      data-testid="kong-auth-accept-invitation-form"
      novalidate
      @submit.prevent="submitForm"
    >
      <div>
        <KInput
          id="full_name"
          v-model.trim="formData.fullName"
          autocomplete="name"
          class="kong-auth-input"
          data-testid="kong-auth-accept-invitation-full-name"
          :has-error="currentState.matches('error') && error && fieldsHaveError && !formData.fullName ? true : false"
          :label="`${messages.inputLabels.fullName}`"
          required
          type="text"
        />
      </div>

      <div>
        <KInput
          id="preferred_name"
          v-model.trim="formData.preferredName"
          autocomplete="name"
          class="kong-auth-input"
          data-testid="kong-auth-accept-invitation-preferred-name"
          :has-error="currentState.matches('error') && error && fieldsHaveError ? true : false"
          :label="`${messages.inputLabels.preferredName}`"
          type="text"
        />
      </div>

      <KInput
        id="email"
        v-model.trim="formData.email"
        autocomplete="email"
        class="kong-auth-input"
        data-testid="kong-auth-accept-invitation-email"
        :has-error="currentState.matches('error') && error && fieldsHaveError && !formData.email ? true : false"
        :label="`${messages.inputLabels.email}`"
        :readonly="formData.prepopulated"
        required
        type="email"
      />

      <KInput
        id="password"
        v-model.trim="formData.password"
        autocomplete="new-password"
        class="kong-auth-input"
        data-testid="kong-auth-accept-invitation-password"
        :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
        :help="messages.acceptInvitation.passwordHelpText"
        :label="`${messages.inputLabels.password}`"
        required
        type="password"
      />

      <div
        v-if="currentState.matches('error') && passwordError && error"
        data-testid="kong-auth-accept-invitation-alert"
      >
        <ErrorMessage :error="error" />
      </div>

      <KButton
        appearance="primary"
        class="accept-invitation-submit"
        data-testid="kong-auth-accept-invitation-submit"
        :disabled="btnDisabled"
        size="large"
        type="submit"
      >
        <ProgressIcon
          v-if="currentState.matches('pending')"
          class="spin-icon"
          :size="KUI_ICON_SIZE_40"
        />
        {{ btnText }}
      </KButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, ref, reactive, computed, onMounted } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useI18n from '@/composables/useI18n'
import useAxios from '@/composables/useAxios'
import { acceptInvitationEmits } from '@/components/emits'
import type { AxiosResponse } from 'axios'
import { ProgressIcon } from '@kong/icons'
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
// Components
import { KButton, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

const emit = defineEmits(acceptInvitationEmits)

const { customErrorHandler, lang } = useConfigOptions()
const { messages } = useI18n(lang)

/**
 * Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value.
 * Do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
 *
 * The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the
 * custom element provide().
 */
const subheaderText: Ref<string> = inject('invite-subheader-text', ref(messages.acceptInvitation.subheader))

const formData = reactive({
  email: '',
  fullName: '',
  preferredName: '',
  inviteToken: '',
  organization: '',
  password: '',
  prepopulated: false,
})

const error = ref<any>(null)
const passwordError = ref<boolean>(false)
const fieldsHaveError = ref(false)

const { state: currentState, send } = useMachine(
  createMachine({
    predictableActionArguments: true,
    id: 'ACCEPT_INVITATION',
    initial: 'idle',
    states: {
      idle: {
        on: { CLICK_CREATE_ACCOUNT: 'pending' },
      },
      pending: {
        on: { RESOLVE: 'success', REJECT: 'error' },
      },
      error: {
        on: { CLICK_CREATE_ACCOUNT: 'pending' },
      },
      success: {},
    },
  }),
)

// Don't check here for the token; let the user submit to let the backend tell them their token is invalid/missing
const userCanSubmitForm = computed((): boolean => !!(formData.email && formData.fullName && formData.password))

const btnText = computed((): string => ['pending', 'success'].some(currentState.value.matches) ? messages.acceptInvitation.submittingText : messages.acceptInvitation.submitText)
const btnDisabled = computed((): boolean => currentState.value.matches('pending') || !userCanSubmitForm.value)

const { axiosInstance } = useAxios()
const acceptInvitation = async (): Promise<AxiosResponse<any>> => {
  return await axiosInstance.post('/v2/accept-invite', {
    password: formData.password,
    full_name: formData.fullName,
    preferred_name: formData.preferredName || null, // send null to kauth if preferred_name is empty string or undefined
    token: formData.inviteToken,
  })
}

const submitForm = async (): Promise<void> => {
  send('CLICK_CREATE_ACCOUNT')

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
    await acceptInvitation()

    send('RESOLVE')

    // Emit success
    emit('accept-invitation-success', {
      email: formData.email,
    })
  } catch (err: any) {
    send('REJECT')

    const customEndpointErrorMessage = typeof customErrorHandler === 'function' && customErrorHandler({ error: err, request: 'accept-invitation-request', element: 'kong-auth-accept-invitation' })

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

  formData.inviteToken = urlParams?.get('token') || ''
  formData.fullName = urlParams?.get('fullName') || ''
  formData.organization = urlParams?.get('org') || ''
  formData.email = urlParams?.get('email') || ''

  // If `token` and `email` values were passed in, set formData.prepopulated to true
  formData.prepopulated = !!(urlParams?.get('token') && urlParams?.get('email'))
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@use "@/assets/styles/elements" as *;
</style>
