<template>
  <BaseCustomElement>
    <ForgotPasswordForm />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue'

export default defineComponent({
  name: 'KongAuthForgotPassword',

  // Props are defined here for use on the custom element tag
  props: {
    loginUrl: String,
  },

  components: {
    BaseCustomElement,
    ForgotPasswordForm,
  },

  setup(props) {
    const loginUrlRef = ref(props.loginUrl)
    provide('login-url', loginUrlRef.value)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
