<template>
  <BaseCustomElement>
    <ForgotPassword
      @click-login-link="(emitData) => $emit('click-login-link', emitData)"
      @forgot-password-success="
        (emitData) => $emit('forgot-password-success', emitData)
      " />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'

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
  },

  emits: ['click-login-link', 'forgot-password-success'],

  components: {
    BaseCustomElement,
    ForgotPassword,
  },

  setup(props) {
    // Provide custom element props to child components
    provide(
      'show-login-link',
      computed((): boolean => props.showLoginLink),
    )

    provide(
      'login-link-text',
      computed((): string =>
        props.loginLinkText
          ? props.loginLinkText
          : helpText.forgotPassword.loginLinkText,
      ),
    )

    provide(
      'instruction-text',
      computed((): string =>
        props.instructionText ? props.instructionText : '',
      ),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
