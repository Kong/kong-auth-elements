<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <ForgotPasswordForm
        @click-login-link="(emitData: any) => $emit('click-login-link', emitData)"
        @forgot-password-success="(emitData: any) => $emit('forgot-password-success', emitData)"
      />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'
import { forgotPasswordEmits } from '@/components/emits'

// Props are defined here for use on the custom element tag
const props = defineProps({
  wrapperId: {
    type: String,
    required: false,
    default: 'kong-auth-forgot-password-wrapper',
  },
  showLoginLink: {
    type: Boolean,
    default: false,
  },
  wrapRequest: {
    type: Function,
    default: null,
  },
  loginLinkText: {
    type: String,
    default: null,
  },
  instructionText: {
    type: String,
    default: '',
  },
  successText: {
    type: String,
    default: null,
  },
  resetPasswordRequestEndpoint: {
    type: String,
    default: '',
  },
})

// Import emits from child component with validation, where necessary
defineEmits(forgotPasswordEmits)

// Provide custom element props to child components - this allows all props to remain reactive

provide(
  'show-login-link',
  computed((): boolean => props.showLoginLink),
)

provide(
  'instruction-text',
  computed((): string => (props.instructionText ? props.instructionText : '')),
)

provide(
  'reset-password-request-endpoint',
  computed((): string => (props.resetPasswordRequestEndpoint ? props.resetPasswordRequestEndpoint : '')),
)

provide(
  'wrap-request',
  computed((): any => (props.wrapRequest ? props.wrapRequest : null)),
)

// Message props: These provided values default to useI18n() message text so
// they must be provided in this format so the default value can be set in the child component.
props.loginLinkText && provide('login-link-text', computed((): string => props.loginLinkText))
props.successText && provide('success-text', computed((): string => props.successText))
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
