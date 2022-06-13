<template>
  <Teleport v-if="shouldRender" :to="teleportSelector" :disabled="disableTeleport">
    <BaseCustomElement>
      <ForgotPasswordForm
        @forgot-password-success="(emitData) => $emit('forgot-password-success', emitData)"
        @click-login-link="(emitData) => $emit('click-login-link', emitData)"
      />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import useTeleport from '@/composables/useTeleport'
import useI18n from '@/composables/useI18n'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPasswordForm, { forgotPasswordEmits } from '@/components/ForgotPasswordForm.vue'

const { messages } = useI18n()

export default defineComponent({
  name: 'KongAuthForgotPassword',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: true,
      default: 'kong-auth-forgot-password-wrapper',
    },
    showLoginLink: {
      type: Boolean,
      default: false,
    },
    loginLinkText: {
      type: String,
      default: messages.forgotPassword.loginLinkText,
    },
    instructionText: {
      type: String,
      default: '',
    },
    successText: {
      type: String,
      default: messages.forgotPassword.success,
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
      computed((): string => (props.loginLinkText ? props.loginLinkText : messages.forgotPassword.loginLinkText)),
    )

    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )

    provide(
      'success-text',
      computed((): string => (props.successText ? props.successText : messages.forgotPassword.success)),
    )

    provide(
      'reset-password-request-endpoint',
      computed((): string => (props.resetPasswordRequestEndpoint ? props.resetPasswordRequestEndpoint : '')),
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
