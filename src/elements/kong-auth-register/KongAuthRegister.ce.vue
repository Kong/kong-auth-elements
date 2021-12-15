<template>
  <BaseCustomElement>
    <Register @register-success="(emitData) => $emit('register-success', emitData)" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import Register from '@/components/Register.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    accessCodeRequired: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['register-success'],

  components: {
    BaseCustomElement,
    Register,
  },

  setup(props) {
    // Provide custom element props to child components
    provide(
      'access-code-required',
      computed((): boolean => props.accessCodeRequired),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
