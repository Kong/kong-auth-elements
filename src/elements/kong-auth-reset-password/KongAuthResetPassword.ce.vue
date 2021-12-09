<template>
  <BaseCustomElement>
    <ResetPassword @reset-password-success="(emitData) => $emit('reset-password-success', emitData)" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import ResetPassword from '@/components/ResetPassword.vue'

export default defineComponent({
  name: 'KongAuthResetPassword',

  // Props are defined here for use on the custom element tag
  props: {},

  emits: ['reset-password-success'],

  components: {
    BaseCustomElement,
    ResetPassword,
  },

  setup(props) {
    // Provide custom element props to child components
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
