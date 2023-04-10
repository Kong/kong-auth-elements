<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <ChangePasswordForm
        @change-password-success=" $emit('change-password-success')"
        @password-requirements="(emitData: any) => $emit('password-requirements', emitData)"
      />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ChangePasswordForm from '@/components/ChangePasswordForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'
import { changePasswordEmits } from '@/components/emits'

// Props are defined here for use on the custom element tag
const props = defineProps({
  wrapperId: {
    type: String,
    required: false,
    default: 'kong-auth-change-password-wrapper',
  },
  instructionText: {
    type: String,
    default: '',
  },
  changePasswordButtonText: {
    type: String,
    default: '',
  },
})

// Import emits from child component with validation, where necessary
defineEmits(changePasswordEmits)

// Provide custom element props to child components - this allows all props to remain reactive

provide(
  'instruction-text',
  computed((): string => (props.instructionText ? props.instructionText : '')),
)
// Message props: These provided values default to useI18n() message text so
// they must be provided in this format so the default value can be set in the child component.
props.changePasswordButtonText && provide('change-password-button-text', computed((): string => props.changePasswordButtonText))
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
