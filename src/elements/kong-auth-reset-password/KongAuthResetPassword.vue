<template>
  <div class="kong-auth-element">
    <BaseCustomElement>
      <ResetPasswordForm
        @reset-password-success="(emitData) => $emit('reset-password-success', emitData)"
      />
    </BaseCustomElement>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPasswordForm, { resetPasswordEmits } from '@/components/ResetPasswordForm.vue'

export default defineComponent({
  name: 'KongAuthResetPassword',

  // Props are defined here for use on the custom element tag
  props: {
    instructionText: String,
    showPasswordStrengthMeter: Boolean,
  },

  // Import emits from child component with validation, where necessary
  emits: resetPasswordEmits,

  components: {
    BaseCustomElement,
    ResetPasswordForm,
  },

  setup(props) {
    // Provide custom element props to child components - this allows all props to remain reactive
    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )
    provide(
      'show-password-strength-meter',
      computed((): boolean => (props.showPasswordStrengthMeter ? props.showPasswordStrengthMeter : false)),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
