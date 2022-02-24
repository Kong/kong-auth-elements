<template>
  <div class="kong-auth-element">
    <BaseCustomElement>
      <Register @register-success="(emitData) => $emit('register-success', emitData)" />
    </BaseCustomElement>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import Register, { registerEmits } from '@/components/Register.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    accessCodeRequired: Boolean,
    instructionText: String,
    showPasswordStrengthMeter: Boolean,
  },

  // Import emits from child component with validation, where necessary
  emits: registerEmits,

  components: {
    BaseCustomElement,
    Register,
  },

  setup(props) {
    // Provide custom element props to child components
    provide(
      'access-code-required',
      computed((): boolean => (props.accessCodeRequired ? props.accessCodeRequired : false)),
    )
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
