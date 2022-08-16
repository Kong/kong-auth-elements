<template>
  <Teleport v-if="shouldRender" :to="teleportSelector" :disabled="disableTeleport">
    <BaseCustomElement>
      <AcceptInvitationForm @accept-invitation-success="(emitData: any) => $emit('accept-invitation-success', emitData)" />
    </BaseCustomElement>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import useTeleport from '@/composables/useTeleport'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import AcceptInvitationForm, { acceptInvitationEmits } from '@/components/AcceptInvitationForm.vue'

export default defineComponent({
  name: 'KongAuthAcceptInvitation',

  // Props are defined here for use on the custom element tag
  props: {
    wrapperId: {
      type: String,
      required: true,
      default: 'kong-auth-accept-invitation-wrapper',
    },
    subheaderText: {
      type: String,
      default: null,
    },
  },

  // Import emits from child component with validation, where necessary
  emits: acceptInvitationEmits,

  components: {
    BaseCustomElement,
    AcceptInvitationForm,
  },

  setup(props) {
    // Message props: These provided values default to useI18n() message text so
    // they must be provided in this format so the default value can be set in the child component.
    props.subheaderText && provide('invite-subheader-text', computed((): string => props.subheaderText))

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
