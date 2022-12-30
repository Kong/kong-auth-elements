<template>
  <TeleportWrapper :parent-props="$props">
    <BaseCustomElement>
      <AcceptInvitationForm @accept-invitation-success="(emitData: any) => $emit('accept-invitation-success', emitData)" />
    </BaseCustomElement>
  </TeleportWrapper>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import BaseCustomElement from '@/components/BaseCustomElement.vue'
import AcceptInvitationForm from '@/components/AcceptInvitationForm.vue'
import TeleportWrapper from '@/components/TeleportWrapper.vue'
import { acceptInvitationEmits } from '@/components/emits'

// Props are defined here for use on the custom element tag
const props = defineProps({
  wrapperId: {
    type: String,
    required: false,
    default: 'kong-auth-accept-invitation-wrapper',
  },
  subheaderText: {
    type: String,
    default: null,
  },
})

// Import emits from child component with validation, where necessary
defineEmits(acceptInvitationEmits)

// Message props: These provided values default to useI18n() message text so
// they must be provided in this format so the default value can be set in the child component.
props.subheaderText && provide('invite-subheader-text', computed((): string => props.subheaderText))
</script>

<style lang="scss">
// No styles should be added to this component.
</style>
