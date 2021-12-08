<template>
  <BaseCustomElement>
    <Register @register-success="(emitData) => $emit('register-success', emitData)" />
  </BaseCustomElement>
</template>

<script lang="ts">
import { defineComponent, provide, computed, reactive } from 'vue'
import BaseCustomElement from '@/elements/BaseCustomElement.vue'
import Register from '@/components/Register.vue'

export default defineComponent({
  name: 'KongAuthRegister',

  // Props are defined here for use on the custom element tag
  props: {
    email: String,
    emailToken: String,
    firstName: String,
    lastName: String,
    organization: String,
  },

  emits: ['register-success'],

  components: {
    BaseCustomElement,
    Register,
  },

  setup(props) {
    // Provide custom element props to child components
    const propFormData = reactive({
      email: props.email ? props.email : '',
      emailToken: props.emailToken ? props.emailToken : '',
      firstName: props.firstName ? props.firstName : '',
      lastName: props.lastName ? props.lastName : '',
      organization: props.organization ? props.organization : '',
      prepopulated: computed((): boolean =>
        props.email && props.emailToken && props.firstName && props.lastName && props.organization ? true : false,
      ),
    })

    provide('register-form-data', propFormData)
  },
})
</script>

<style lang="scss">
// No styles should be added to this component; add styles to child components
</style>
