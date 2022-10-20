<template>
  <div v-if="shouldRender">
    <slot v-if="!shadowDom" name="default" />
    <Teleport v-else-if="shadowDom && shouldRender" :to="teleportSelector" :disabled="disableTeleport">
      <slot name="default" />
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useConfigOptions from '@/composables/useConfigOptions'
import useTeleport from '@/composables/useTeleport'

export default defineComponent({
  name: 'TeleportWrapper',
  props: {
    parentProps: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { shadowDom } = useConfigOptions()
    const { teleportSelector, disableTeleport, shouldRender } = useTeleport(props.parentProps, shadowDom)

    return {
      shadowDom,
      teleportSelector,
      shouldRender,
      disableTeleport,
    }
  },
})
</script>
