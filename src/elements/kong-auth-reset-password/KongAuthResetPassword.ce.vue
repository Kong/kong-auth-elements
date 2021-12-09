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

  emits: ['reset-password-success'],

  components: {
    BaseCustomElement,
    ResetPassword,
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
