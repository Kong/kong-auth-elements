<template>
  <div v-html="injectedStyles"></div>
  <AppWrapper />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue'
import AppWrapper from '@/components/AppWrapper.ce.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppWrapper
  },
  setup () {
    const inlineStyles = ref<HTMLElement[]>([])
    const injectedStyles = computed(() => {
      return `<style data-extracted>${inlineStyles.value.map((style) => style.innerHTML).join('')}</style>`
    })

    const injectStyles = () => {
      inlineStyles.value = Array.from(
        document.head.getElementsByTagName('style')
      ).filter((styleNode) => {
        // Only inject styles if they contain @kongponent prefix
        return styleNode.innerHTML.includes('.k-')
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
