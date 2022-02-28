<template>
  <div class="kong-auth-element">
    <BaseCustomElement>
      <LoginForm
        @click-forgot-password-link="(emitData) => $emit('click-forgot-password-link', emitData)"
        @click-register-link="(emitData) => $emit('click-register-link', emitData)"
        @login-success="(emitData) => $emit('login-success', emitData)"
        @verify-email-success="(emitData) => $emit('verify-email-success', emitData)"
        @idp-is-loading="(emitData) => $emit('idp-is-loading', emitData)"
      />
    </BaseCustomElement>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import LoginForm, { loginEmits } from '@/components/LoginForm.vue'

export default defineComponent({
  name: 'KongAuthLogin',

  // Props are defined here for use on the custom element tag
  props: {
    instructionText: String,
    showForgotPasswordLink: {
      type: Boolean,
      default: false,
    },
    forgotPasswordLinkText: String,
    showRegisterLink: {
      type: Boolean,
      default: false,
    },
    registerLinkHelpText: String,
    registerLinkText: String,
    idpLoginEnabled: {
      type: Boolean,
      default: false,
    },
    idpLoginReturnTo: {
      type: String,
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

    // IDP
    provide(
      'idp-login-enabled',
      computed((): boolean => props.idpLoginEnabled),
    )
    provide(
      'idp-login-return-to',
      computed((): string => (props.idpLoginReturnTo ? props.idpLoginReturnTo : '')),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
