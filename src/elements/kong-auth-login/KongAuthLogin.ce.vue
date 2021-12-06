<template>
  <BaseCustomElement>
    <Login
      @click-forgot-password-link="$emit('click-forgot-password-link')"
      @click-register-link="$emit('click-register-link')"
      @login-success="$emit('login-success')" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
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
    registerHelpText: String,
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
    provide('show-forgot-password-link', props.showForgotPasswordLink)
    provide('forgot-password-link-text', props.forgotPasswordLinkText)

    // Register
    provide('show-register-link', props.showRegisterLink)
    provide('register-help-text', props.registerHelpText)
    provide('register-link-text', props.registerLinkText)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
