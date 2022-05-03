<template>
  <Teleport v-if="shouldRender" :to="teleportSelector" :disabled="disableTeleport">
    <BaseCustomElement>
      <ResetPasswordForm
        @reset-password-success="(emitData) => $emit('reset-password-success', emitData)"
      />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue'
import useTeleport from '@/composables/useTeleport'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPasswordForm, { resetPasswordEmits } from '@/components/ResetPasswordForm.vue'

export default defineComponent({
  name: 'KongAuthResetPassword',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: true,
      default: 'kong-auth-reset-password-wrapper',
    },
    instructionText: {
      type: String,
      default: '',
    },
    showPasswordStrengthMeter: {
      type: Boolean,
      default: false,
    },
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

    const { teleportSelector, disableTeleport, shouldRender } = useTeleport(props)

    return {
      teleportSelector,
      disableTeleport,
      shouldRender,
    }
  },
})
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
