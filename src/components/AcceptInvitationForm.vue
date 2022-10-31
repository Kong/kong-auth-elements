<template>
  <div class="kong-auth-accept-invitation-form">
    <h2 v-if="!currentState.matches('success') && organization"
      class="accept-invitation-subheader color-black-70 mb-6"
      data-testid="kong-auth-accept-invitation-subheader"
    ><span data-testid="kong-auth-accept-invitation-subheader-text">{{ subheaderText }}</span> <span data-testid="kong-auth-accept-invitation-org-name">{{ organization }}</span>!</h2>

    <div
      v-if="currentState.matches('error') && !passwordError && error"
      class="my-4"
      data-testid="kong-auth-accept-invitation-alert"
    >
      <ErrorMessage :error="error" />
    </div>

    <form
      v-if="!currentState.matches('success')"
      class="accept-invitation-form"
      @submit.prevent="submitForm"
      novalidate
      data-testid="kong-auth-accept-invitation-form"
    >

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
          data-testid="kong-auth-accept-invitation-full-name"
        />
      </div>

      <KInput
        id="email"
        v-model.trim="email"
        type="email"
        :label="`${messages.inputLabels.email} *`"
        class="w-100 mb-4"
        autocomplete="email"
        :readonly="prepopulated"
        :has-error="currentState.matches('error') && error && fieldsHaveError && !email ? true : false"
        required
        data-testid="kong-auth-accept-invitation-email"
      />

        <KInput
          id="password"
          v-model.trim="password"
          type="password"
          :label="`${messages.inputLabels.password} *`"
          class="w-100"
          autocomplete="new-password"
          :has-error="currentState.matches('error') && error && (fieldsHaveError || passwordError) ? true : false"
          required
          data-testid="kong-auth-accept-invitation-password"
        />
        <p class="help mb-4">{{ messages.acceptInvitation.passwordHelpText }}</p>

      <div
        v-if="currentState.matches('error') && passwordError && error"
        data-testid="kong-auth-accept-invitation-alert"
      >
        <ErrorMessage :error="error" />
      </div>

      <KButton
        type="submit"
        appearance="primary"
        class="accept-invitation-submit justify-content-center w-100 type-lg mt-6"
        :disabled="btnDisabled"
        data-testid="kong-auth-accept-invitation-submit"
      >
        <KIcon
          v-if="currentState.matches('pending')"
          icon="spinner"
          size="16"
          color="var(--grey-400)"
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
import { win } from '@/utils'
import useConfigOptions from '@/composables/useConfigOptions'
import useKongAuthApi from '@/composables/useKongAuthApi'
import useI18n from '@/composables/useI18n'
import { AxiosResponse } from 'axios'
// Components
import { KButton, KIcon, KInput } from '@kong/kongponents'
import ErrorMessage from '@/components/ErrorMessage.vue'

export const acceptInvitationEmits = {
  'accept-invitation-success': (payload: { email: string }): boolean => {
    return !!payload?.email.trim()
  },
}

export default defineComponent({
  name: 'AcceptInvitationForm',

  components: {
    ErrorMessage,
    KButton,
    KIcon,
    KInput,
  },

  // Define emits with validation, where necessary
  emits: acceptInvitationEmits,

  setup(props, { emit }) {
    const { userEntity, customErrorHandler, lang } = useConfigOptions()
    const { api } = useKongAuthApi()
    const { messages } = useI18n(lang)

    /*
    Get custom element props. If set up properly, these should be refs, meaning you can access them in the setup() with {variable-name}.value - do not pass parent src/elements/{dir}/{CustomElement}.ce.vue file props as they will not remain reactive.
    The default values provided to inject() here should be refs with empty string or false since the defaults are typically handled in the custom element provide()
    */
    const subheaderText: Ref<string> = inject('invite-subheader-text', ref(messages.acceptInvitation.subheader))

    const formData = reactive({
      email: '',
      fullName: '',
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

    const userCanSubmitForm = computed((): boolean => {
      // Don't check here for the token; let the user submit to let the backend tell them their token is invalid/missing
      return !!(formData.email &&
        formData.fullName &&
        formData.password
      )
    })

    const btnText = computed((): string => {
      return ['pending', 'success'].some(currentState.value.matches) ? messages.acceptInvitation.submittingText : messages.acceptInvitation.submitText
    })

    const btnDisabled = computed((): boolean => {
      return currentState.value.matches('pending') || !userCanSubmitForm.value
    })

    const acceptInvitation = async (): Promise<AxiosResponse<any>> => {
      return await api.client.patch('/v2/accept-invite', {
        password: formData.password,
        full_name: formData.fullName,
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
      formData.prepopulated =
        !!(urlParams?.get('token') && urlParams?.get('email'))
    })

    return {
      currentState,
      btnText,
      btnDisabled,
      messages,
      subheaderText,
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

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
