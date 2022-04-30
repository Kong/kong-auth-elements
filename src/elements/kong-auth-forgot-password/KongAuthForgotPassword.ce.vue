<template>
  <Teleport :to="wrapperSelector" :disabled="disableTeleport">
    <BaseCustomElement>
      <ForgotPasswordForm
        @forgot-password-success="(emitData) => $emit('forgot-password-success', emitData)"
        @click-login-link="(emitData) => $emit('click-login-link', emitData)"
      />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, provide, computed, ref } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPasswordForm, { forgotPasswordEmits } from '@/components/ForgotPasswordForm.vue'

export default defineComponent({
  name: 'KongAuthForgotPassword',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperSelector: {
      type: String,
      required: true,
      default: '#kong-auth-forgot-password-wrapper',
    },
    showLoginLink: {
      type: Boolean,
      default: false,
    },
    loginLinkText: {
      type: String,
      default: helpText.forgotPassword.loginLinkText,
    },
    instructionText: {
      type: String,
      default: '',
    },
    successText: {
      type: String,
      default: helpText.forgotPassword.success,
    },
    resetPasswordRequestEndpoint: {
      type: String,
      default: '',
    },
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
