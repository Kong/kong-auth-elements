<template>
  <Teleport :to="wrapperId" :disabled="disableTeleport">
    <BaseCustomElement>
      <LoginForm
        @click-forgot-password-link="(emitData) => $emit('click-forgot-password-link', emitData)"
        @click-register-link="(emitData) => $emit('click-register-link', emitData)"
        @login-success="(emitData) => $emit('login-success', emitData)"
        @verify-email-success="(emitData) => $emit('verify-email-success', emitData)"
        @idp-is-loading="(emitData) => $emit('idp-is-loading', emitData)"
        />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, provide, computed, ref } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import LoginForm, { loginEmits } from '@/components/LoginForm.vue'

export default defineComponent({
  name: 'KongAuthLogin',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: true,
      default: '#kong-auth-login-wrapper',
      // require the value to be an id starting with a hash
      validator: (val: string): boolean => val.startsWith('#'),
    },
    instructionText: {
      type: String,
      default: '',
    },
    showForgotPasswordLink: {
      type: Boolean,
      default: false,
    },
    forgotPasswordLinkText: {
      type: String,
      default: helpText.login.forgotPasswordLinkText,
    },
    showRegisterLink: {
      type: Boolean,
      default: false,
    },
    registerLinkHelpText: {
      type: String,
      default: helpText.login.registerLinkHelpText,
    },
    registerLinkText: {
      type: String,
      default: helpText.login.registerLinkText,
    },
    registerSuccessText: {
      type: String,
      default: helpText.login.registerSuccess,
    },
    idpLoginEnabled: {
      type: Boolean,
      default: false,
    },
    idpLoginReturnTo: {
      type: String,
      default: '',
    },
  },

  // Import emits from child component with validation, where necessary
  emits: loginEmits,

  components: {
    BaseCustomElement,
    LoginForm,
  },

  setup(props) {
    // Provide custom element props to child components - this allows all props to remain reactive

    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )

    // Forgot password
    provide(
      'show-forgot-password-link',
      computed((): boolean => props.showForgotPasswordLink),
    )
    provide(
      'forgot-password-link-text',
      computed((): string =>
        props.forgotPasswordLinkText ? props.forgotPasswordLinkText : helpText.login.forgotPasswordLinkText,
      ),
    )

    // Register
    provide(
      'show-register-link',
      computed((): boolean => props.showRegisterLink),
    )
    provide(
      'register-link-help-text',
      computed((): string =>
        props.registerLinkHelpText ? props.registerLinkHelpText : helpText.login.registerLinkHelpText,
      ),
    )
    provide(
      'register-link-text',
      computed((): string => (props.registerLinkText ? props.registerLinkText : helpText.login.registerLinkText)),
    )
    provide(
      'register-success-text',
      computed((): string => (props.registerSuccessText ? props.registerSuccessText : helpText.login.registerSuccess)),
    )

    // IDP
    provide(
      'idp-login-enabled',
      computed((): boolean => props.idpLoginEnabled),
    )
    provide(
      'idp-login-return-to',
      computed((): string => (props.idpLoginReturnTo ? props.idpLoginReturnTo : '')),
    )

    // Disable Teleport if utilized as a Custom Element
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const disableTeleport = ref(!props.shouldTeleport)

    return {
      disableTeleport,
    }
  },
})
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
