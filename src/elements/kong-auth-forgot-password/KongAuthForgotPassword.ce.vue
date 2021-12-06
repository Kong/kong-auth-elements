<template>
  <BaseCustomElement>
    <ForgotPassword />
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
    loginUrl: String,
    instructions: String,
  },

  components: {
    BaseCustomElement,
    ForgotPassword,
  },

  setup(props) {
    // Provide custom element props to child components
    const loginUrlRef = ref(props.loginUrl)
    provide('login-url', loginUrlRef.value)

    const instructionsRef = ref(props.instructions)
    provide('instructions', instructionsRef.value)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
