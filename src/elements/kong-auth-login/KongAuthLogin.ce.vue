<template>
  <BaseCustomElement>
    <Login
      @click-forgot-password-link="(emitData) => $emit('click-forgot-password-link', emitData)"
      @click-register-link="(emitData) => $emit('click-register-link', emitData)"
      @login-success="(emitData) => $emit('login-success', emitData)" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import Login from '@/components/Login.vue'

export default defineComponent({
  name: 'KongAuthLogin',

  // Props are defined here for use on the custom element tag
  props: {
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
  },

  emits: ['click-forgot-password-link', 'click-register-link', 'login-success'],

  components: {
    BaseCustomElement,
    Login,
  },

  setup(props) {
    // Provide custom element props to child components

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
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
