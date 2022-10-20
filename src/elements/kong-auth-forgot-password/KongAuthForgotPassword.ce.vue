<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <ForgotPasswordForm
        @forgot-password-success="(emitData: any) => $emit('forgot-password-success', emitData)"
        @click-login-link="(emitData: any) => $emit('click-login-link', emitData)"
      />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPasswordForm, { forgotPasswordEmits } from '@/components/ForgotPasswordForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'

export default defineComponent({
  name: 'KongAuthForgotPassword',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: false,
      default: 'kong-auth-forgot-password-wrapper',
    },
    showLoginLink: {
      type: Boolean,
      default: false,
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
  },

  // Import emits from child component with validation, where necessary
  emits: forgotPasswordEmits,

  components: {
    TeleportWrapper,
    BaseCustomElement,
    ForgotPasswordForm,
  },

  setup(props) {
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

    // Message props: These provided values default to useI18n() message text so
    // they must be provided in this format so the default value can be set in the child component.
    props.loginLinkText && provide('login-link-text', computed((): string => props.loginLinkText))
    props.successText && provide('success-text', computed((): string => props.successText))
  },
})
</script>

<style lang="scss" scoped>
// No styles should be added to this component.
</style>
