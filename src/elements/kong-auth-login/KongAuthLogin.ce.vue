<template>
  <BaseCustomElement>
    <Login
      @click-forgot-password="$emit('click-forgot-password')"
      @click-register="$emit('click-register')" />
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
    showForgotPassword: {
      type: Boolean,
      default: false,
    },
    forgotPasswordLinkText: String,
    showRegister: {
      type: Boolean,
      default: false,
    },
    registerHelpText: String,
    registerLinkText: String,
  },

  emits: ['click-forgot-password', 'click-register'],

  components: {
    BaseCustomElement,
    Login,
  },

  setup(props) {
    // Provide custom element props to child components

    // Forgot password
    const showForgotPasswordRef = ref(props.showForgotPassword)
    provide('show-forgot-password', showForgotPasswordRef.value)
    const forgotPasswordLinkTextRef = ref(props.forgotPasswordLinkText)
    provide('forgot-password-link-text', forgotPasswordLinkTextRef.value)

    // Register
    const showRegisterRef = ref(props.showRegister)
    provide('show-register', showRegisterRef.value)
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
