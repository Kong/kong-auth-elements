<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <LoginForm
        @click-forgot-password-link="(emitData: any) => $emit('click-forgot-password-link', emitData)"
        @click-register-link="(emitData: any) => $emit('click-register-link', emitData)"
        @idp-is-loading="(emitData: any) => $emit('idp-is-loading', emitData)"
        @login-success="(emitData: any) => $emit('login-success', emitData)"
        @verify-email-success="(emitData: any) => $emit('verify-email-success', emitData)"
        />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import LoginForm from '@/components/LoginForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'
import { loginEmits } from '@/components/emits'

// Props are defined here for use on the custom element tag
const props = defineProps({
  wrapperId: {
    type: String,
    required: false,
    default: 'kong-auth-login-wrapper',
  },
  instructionText: {
    type: String,
    default: '',
  },
  showForgotPasswordLink: {
    type: Boolean,
    default: false,
  },
  forgotPasswordLinkText: {
    type: String,
    default: null,
  },
  showRegisterLink: {
    type: Boolean,
    default: false,
  },
  registerLinkHelpText: {
    type: String,
    default: null,
  },
  registerLinkText: {
    type: String,
    default: null,
  },
  registerSuccessText: {
    type: String,
    default: null,
  },
  basicAuthLoginEnabled: {
    type: Boolean,
    default: false, // must be false by default
  },
  idpLoginEnabled: {
    type: Boolean,
    default: false,
  },
  idpLoginReturnTo: {
    type: String,
    default: '',
  },
})

// Import emits from child component with validation, where necessary
defineEmits(loginEmits)

// Provide custom element props to child components - this allows all props to remain reactive

provide(
  'instruction-text',
  computed((): string => (props.instructionText ? props.instructionText : '')),
)

// Forgot password
provide(
  'show-forgot-password-link',
  computed((): boolean => props.showForgotPasswordLink),
)

// Register
provide(
  'show-register-link',
  computed((): boolean => props.showRegisterLink),
)

// Basic Auth
provide(
  'basic-auth-login-enabled',
  computed((): boolean => props.basicAuthLoginEnabled),
)

// IDP
provide(
  'idp-login-enabled',
  computed((): boolean => props.idpLoginEnabled),
)
provide(
  'idp-login-return-to',
  computed((): string => (props.idpLoginReturnTo ? props.idpLoginReturnTo : '')),
)

// Message props: These provided values default to useI18n() message text so
// they must be provided in this format so the default value can be set in the child component.
props.forgotPasswordLinkText && provide('forgot-password-link-text', computed((): string => props.forgotPasswordLinkText))
props.registerLinkHelpText && provide('register-link-help-text', computed((): string => props.registerLinkHelpText))
props.registerLinkText && provide('register-link-text', computed((): string => props.registerLinkText))
props.registerSuccessText && provide('register-success-text', computed((): string => props.registerSuccessText))
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
