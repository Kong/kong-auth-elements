<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <ResetPasswordForm
        @reset-password-success="(emitData: any) => $emit('reset-password-success', emitData)"
      />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ResetPasswordForm from '@/components/ResetPasswordForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'
import { resetPasswordEmits } from '@/components/emits'

// Props are defined here for use on the custom element tag
const props = defineProps({
  wrapperId: {
    type: String,
    required: false,
    default: 'kong-auth-reset-password-wrapper',
  },
  instructionText: {
    type: String,
    default: '',
  },
})

// Import emits from child component with validation, where necessary
defineEmits(resetPasswordEmits)

// Provide custom element props to child components - this allows all props to remain reactive

provide(
  'instruction-text',
  computed((): string => (props.instructionText ? props.instructionText : '')),
)
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
