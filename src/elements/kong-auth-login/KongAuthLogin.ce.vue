<template>
  <BaseCustomElement>
    <LoginForm />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import LoginForm from '@/components/LoginForm.vue'

export default defineComponent({
  name: 'KongAuthLogin',
  // Props are defined here for use on the custom element tag
  props: {
    forgotPasswordUrl: String,
  },
  components: {
    BaseCustomElement,
    LoginForm,
  },
  setup(props) {
    const forgotPasswordUrlRef = ref(props.forgotPasswordUrl)
    provide('forgot-password-url', forgotPasswordUrlRef)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
