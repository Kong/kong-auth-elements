<template>
  <div class="kong-auth-element">
    <BaseCustomElement>
      <Register @register-success="(emitData) => $emit('register-success', emitData)" />
    </BaseCustomElement>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import Register from '@/components/Register.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    instructionText: String,
  },

  emits: ['register-success'],

  components: {
    BaseCustomElement,
    Register,
  },

  setup(props) {
    // Provide custom element props to child components
    provide(
      'instruction-text',
      computed((): string => (props.instructionText ? props.instructionText : '')),
    )
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
