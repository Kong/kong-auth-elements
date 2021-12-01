<template>
  <div v-if="injectedStyles" v-html="injectedStyles"></div>
  <KAuthContainer />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteRecordRaw, RouteRecordName } from 'vue-router'
import { routes } from '@/router'
import useInjectStyles from '@/composables/useInjectStyles'
import KAuthContainer from '@/components/KAuthContainer.vue'

export default defineComponent({
  name: 'KAuthApp',
  // Props are defined here for use on the custom element tag
  // These values are then provided within utils/defineCustomKongElement.ts
  props: {
    initialView: {
      type: String,
      default: 'login',
      validator(value: RouteRecordName) {
        return routes.map((route: RouteRecordRaw) => route.name).includes(value)
      },
    },
  },
  components: {
    KAuthContainer,
  },
  setup() {
    const { injectedStyles } = useInjectStyles()

    return {
      injectedStyles,
    }
  },
})
</script>
