<template>
  <div class="kong-auth-element">
    <BaseCustomElement>
      <ResetPassword
        @reset-password-success="(emitData) => $emit('reset-password-success', emitData)"
      />
    </BaseCustomElement>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPassword from '@/components/ResetPassword.vue'

export default defineComponent({
  name: 'KongAuthResetPassword',

  // Props are defined here for use on the custom element tag
  props: {
    instructionText: String,
  },

  emits: ['reset-password-success'],

  components: {
    BaseCustomElement,
    ResetPassword,
  },

  setup(props) {
    // Provide custom element props to child components
    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
