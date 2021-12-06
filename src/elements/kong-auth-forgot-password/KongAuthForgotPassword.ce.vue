<template>
  <BaseCustomElement>
    <ForgotPassword @click-login-link="$emit('click-login-link')" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
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
    const showLoginLinkRef = ref(props.showLoginLink)
    provide('show-login-link', showLoginLinkRef.value)

    const loginLinkTextRef = ref(props.loginLinkText)
    provide('login-link-text', loginLinkTextRef.value)

    const instructionTextRef = ref(props.instructionText)
    provide('instruction-text', instructionTextRef.value)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
