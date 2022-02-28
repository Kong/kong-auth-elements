<template>
  <div class="kong-auth-element">
    <BaseCustomElement>
      <ForgotPasswordForm
        @forgot-password-success="(emitData) => $emit('forgot-password-success', emitData)"
        @click-login-link="(emitData) => $emit('click-login-link', emitData)"
      />
    </BaseCustomElement>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPasswordForm, { forgotPasswordEmits } from '@/components/ForgotPasswordForm.vue'

export default defineComponent({
  name: 'KongAuthForgotPassword',

  // Props are defined here for use on the custom element tag
  props: {
    showLoginLink: {
      type: Boolean,
      default: false,
    },
    loginLinkText: String,
    instructionText: String,
    successText: String,
    resetPasswordRequestEndpoint: String,
  },

  // Import emits from child component with validation, where necessary
  emits: forgotPasswordEmits,

  components: {
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
      'login-link-text',
      computed((): string => (props.loginLinkText ? props.loginLinkText : helpText.forgotPassword.loginLinkText)),
    )

    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )

    provide(
      'success-text',
      computed((): string => (props.successText ? props.successText : helpText.forgotPassword.success)),
    )

    provide(
      'reset-password-request-endpoint',
      computed((): string => (props.resetPasswordRequestEndpoint ? props.resetPasswordRequestEndpoint : '')),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
