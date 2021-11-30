<template>
  <div v-if="injectedStyles" v-html="injectedStyles"></div>
  <KAuthContainer />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue'
import KAuthContainer from '@/components/KAuthContainer.vue'

export default defineComponent({
  name: 'KAuthApp',
  components: {
    KAuthContainer
  },
  setup () {
    const inlineStyles = ref<HTMLElement[]>([])
    const injectedStyles = computed((): string => `<style type="text/css">${inlineStyles.value.map((styleNode) => styleNode.innerHTML).join('')}</style>`)

    const injectStyles = (): void => {
      inlineStyles.value = Array.from(
        document.head.getElementsByTagName('style')
      ).filter((styleNode) => {
        // Only inject styles if they contain @kongponent prefix, or this exact string: /* KONG_AUTH_INJECT_STYLES */
        return styleNode.innerHTML.includes('.k-') || styleNode.innerHTML.includes('/* KONG_AUTH_INJECT_STYLES */')
      }).filter((styleNode, idx, arr) => {
        // Only return unique nodes (based on the first 100 characters -- anything more is too intensive)
        return arr.findIndex(node => (node.innerHTML.substring(0, 100) === styleNode.innerHTML.substring(0, 100))) === idx
      })
    }

    const observer = new MutationObserver(injectStyles)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true
    })

    onMounted(injectStyles)
    onUnmounted(observer.disconnect)

    return {
      injectedStyles
    }
  }
})
</script>
