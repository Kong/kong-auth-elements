<template>
  <BaseCustomElement>
    <Login />
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
    forgotPasswordText: String,
    forgotPasswordUrl: String,
    registerUrl: String,
  },

  components: {
    BaseCustomElement,
    Login,
  },

  setup(props) {
    // Provide custom element props to child components
    const forgotPasswordTextRef = ref(props.forgotPasswordText)
    provide('forgot-password-text', forgotPasswordTextRef.value)

    const forgotPasswordUrlRef = ref(props.forgotPasswordUrl)
    provide('forgot-password-url', forgotPasswordUrlRef)

    const registerUrlRef = ref(props.registerUrl)
    provide('register-url', registerUrlRef.value)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
