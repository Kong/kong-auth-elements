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
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import ForgotPasswordForm, { forgotPasswordEmits } from '@/components/ForgotPasswordForm.vue'

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
