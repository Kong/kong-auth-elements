<template>
  <Teleport v-if="shouldRender" :to="teleportSelector" :disabled="disableTeleport">
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
import { defineComponent, provide, computed } from 'vue'
import useTeleport from '@/composables/useTeleport'
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
      default: 'kong-auth-login-wrapper',
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
    basicAuthLoginEnabled: {
      type: Boolean,
      default: true,
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

    // Basic Auth
    provide(
      'basic-auth-login-enabled',
      computed((): boolean => props.basicAuthLoginEnabled),
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

    const { teleportSelector, disableTeleport, shouldRender } = useTeleport(props)

    return {
      teleportSelector,
      disableTeleport,
      shouldRender,
    }
  },
})
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
