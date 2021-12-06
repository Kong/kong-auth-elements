<template>
  <BaseCustomElement>
    <ForgotPassword @click-login-link="$emit('click-login-link')" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'

export default defineComponent({
  name: 'KongAuthForgotPassword',

  // Props are defined here for use on the custom element tag
  props: {
    showLoginLink: {
      type: Boolean,
      default: false,
    },
    loginLinkText: String,
    instructionText: String,
  },

  emits: ['click-login-link'],

  components: {
    BaseCustomElement,
    ForgotPassword,
  },

  setup(props) {
    // Provide custom element props to child components
    provide('show-login-link', props.showLoginLink)
    provide('login-link-text', props.loginLinkText)
    provide('instruction-text', props.instructionText)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
