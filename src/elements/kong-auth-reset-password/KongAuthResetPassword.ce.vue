<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <ResetPasswordForm
        @reset-password-success="(emitData: any) => $emit('reset-password-success', emitData)"
      />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPasswordForm, { resetPasswordEmits } from '@/components/ResetPasswordForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'

export default defineComponent({
  name: 'KongAuthResetPassword',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: false,
      default: 'kong-auth-reset-password-wrapper',
    },
    instructionText: {
      type: String,
      default: '',
    },
  },

  // Import emits from child component with validation, where necessary
  emits: resetPasswordEmits,

  components: {
    TeleportWrapper,
    BaseCustomElement,
    ResetPasswordForm,
  },

  setup(props) {
    // Provide custom element props to child components - this allows all props to remain reactive
    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )
  },
})
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
