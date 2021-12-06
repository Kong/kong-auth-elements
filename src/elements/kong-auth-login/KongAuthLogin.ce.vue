<template>
  <BaseCustomElement>
    <Login
      @click-forgot-password-link="$emit('click-forgot-password-link')"
      @click-register-link="$emit('click-register-link')"
      @login-success="$emit('login-success')" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
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
    const showForgotPasswordLinkRef = ref(props.showForgotPasswordLink)
    provide('show-forgot-password-link', showForgotPasswordLinkRef.value)
    const forgotPasswordLinkTextRef = ref(props.forgotPasswordLinkText)
    provide('forgot-password-link-text', forgotPasswordLinkTextRef.value)

    // Register
    const showRegisterLinkRef = ref(props.showRegisterLink)
    provide('show-register-link', showRegisterLinkRef.value)
    const registerHelpTextRef = ref(props.registerHelpText)
    provide('register-help-text', registerHelpTextRef.value)
    const registerLinkTextRef = ref(props.registerLinkText)
    provide('register-link-text', registerLinkTextRef.value)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
