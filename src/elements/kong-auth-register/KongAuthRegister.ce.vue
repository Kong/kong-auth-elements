<template>
  <Teleport :to="wrapperSelector" :disabled="disableTeleport">
    <BaseCustomElement>
      <RegisterForm @register-success="(emitData) => $emit('register-success', emitData)" />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, provide, computed, ref } from 'vue'
import { helpText } from '@/utils'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import RegisterForm, { registerEmits } from '@/components/RegisterForm.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperSelector: {
      type: String,
      required: true,
      default: '#kong-auth-register-wrapper',
    },
    accessCodeRequired: {
      type: Boolean,
      default: false,
    },
    instructionText: {
      type: String,
      default: '',
    },
    showPasswordStrengthMeter: {
      type: Boolean,
      default: false,
    },
    registerButtonText: {
      type: String,
      default: helpText.register.submitText,
    },
    registerRequestEndpoint: {
      type: String,
      default: '',
    },
  },

  // Import emits from child component with validation, where necessary
  emits: registerEmits,

  components: {
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
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )

    provide(
      'show-password-strength-meter',
      computed((): boolean => (props.showPasswordStrengthMeter ? props.showPasswordStrengthMeter : false)),
    )

    provide(
      'register-button-text',
      computed((): string => (props.registerButtonText ? props.registerButtonText : helpText.register.submitText)),
    )

    provide(
      'register-request-endpoint',
      computed((): string => (props.registerRequestEndpoint ? props.registerRequestEndpoint : '')),
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

<style lang="scss">
// No styles should be added to this component.
</style>
