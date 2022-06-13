<template>
  <Teleport v-if="shouldRender" :to="teleportSelector" :disabled="disableTeleport">
    <BaseCustomElement>
      <RegisterForm @register-success="(emitData) => $emit('register-success', emitData)" />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import useTeleport from '@/composables/useTeleport'
import useI18n from '@/composables/useI18n'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import RegisterForm, { registerEmits } from '@/components/RegisterForm.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: true,
      default: 'kong-auth-register-wrapper',
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
      'register-request-endpoint',
      computed((): string => (props.registerRequestEndpoint ? props.registerRequestEndpoint : '')),
    )

    // Message props: These provided values default to useI18n() message text so
    // they must be provided in this format so the default value can be set in the child component.
    props.registerButtonText && provide('register-button-text', computed((): string => props.registerButtonText))

    const { teleportSelector, disableTeleport, shouldRender } = useTeleport(props)

    return {
      teleportSelector,
      disableTeleport,
      shouldRender,
    }
  },
})
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
