<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <RegisterForm @register-success="(emitData: any) => $emit('register-success', emitData)" />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import RegisterForm, { registerEmits } from '@/components/RegisterForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: false,
      default: 'kong-auth-register-wrapper',
    },
    accessCodeRequired: {
      type: Boolean,
      default: false,
    },
    recaptcha: {
      type: Boolean,
      default: false,
    },
    instructionText: {
      type: String,
      default: '',
    },
    registerButtonText: {
      type: String,
      default: null,
    },
    registerRequestEndpoint: {
      type: String,
      default: '',
    },
  },

  // Import emits from child component with validation, where necessary
  emits: registerEmits,

  components: {
    TeleportWrapper,
    BaseCustomElement,
    RegisterForm,
  },

  setup(props) {
    // Provide custom element props to child components - this allows all props to remain reactive
    provide(
      'access-code-required',
      computed((): boolean => (props.accessCodeRequired ? props.accessCodeRequired : false)),
    )

    provide(
      'recaptcha-enabled',
      computed((): boolean => (props.recaptcha ? props.recaptcha : false)),
    )

    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )

    provide(
      'register-request-endpoint',
      computed((): string => (props.registerRequestEndpoint ? props.registerRequestEndpoint : '')),
    )

    // Message props: These provided values default to useI18n() message text so
    // they must be provided in this format so the default value can be set in the child component.
    props.registerButtonText && provide('register-button-text', computed((): string => props.registerButtonText))
  },
})
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
