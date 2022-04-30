<template>
  <Teleport :to="wrapperId" :disabled="disableTeleport">
    <BaseCustomElement>
      <ResetPasswordForm
        @reset-password-success="(emitData) => $emit('reset-password-success', emitData)"
      />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed, provide, ref } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPasswordForm, { resetPasswordEmits } from '@/components/ResetPasswordForm.vue'

export default defineComponent({
  name: 'KongAuthResetPassword',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: true,
      default: '#kong-auth-reset-password-wrapper',
      // require the value to be an id starting with a hash
      validator: (val: string): boolean => val.startsWith('#'),
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

    // Disable Teleport if utilized as a Custom Element
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const disableTeleport = ref(!props.shouldTeleport)

    return {
      disableTeleport,
    }
  },
})
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
