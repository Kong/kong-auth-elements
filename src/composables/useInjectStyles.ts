import { computed, ref, ComputedRef, onMounted, onUnmounted } from 'vue'

interface InjectStylesComposable {
  injectedStyles: ComputedRef<string>
}

export default function useInjectStyles(): InjectStylesComposable {
  const inlineStyles = ref<any>([])
  const injectedStyles = computed((): string =>
    inlineStyles.value && inlineStyles.value.length
      ? `<style type="text/css">${inlineStyles.value
        .map((styleNode: HTMLElement) => styleNode.innerHTML)
        .join('')}</style>`
      : '',
  )

  /**
   * Parses <style> tags found in the document.head and filters them based on the given parameters.
   * Then the styles are injected into the element's shadow DOM for consumption.
   */
  const injectStyles = (): void => {
    inlineStyles.value = Array.from(document.head.getElementsByTagName('style'))
      .filter((styleNode) => {
        // Only inject styles if they contain @kongponent prefix,
        // or this exact string: "/*! KONG_AUTH_INJECT_STYLES */"
        return (
          styleNode.innerHTML.includes('KONG_AUTH_INJECT_STYLES') ||
          styleNode.innerHTML.includes('.k-') ||
          styleNode.innerHTML.includes('.kool') ||
          styleNode.innerHTML.includes('.Password__')
        )
      })
      .filter((styleNode, idx, arr) => {
        // Only return unique nodes (based on the first 100 characters -- anything more is too intensive)
        return (
          arr.findIndex((node) => node.innerHTML.substring(0, 100) === styleNode.innerHTML.substring(0, 100)) === idx
        )
      })
  }

  const observer = new MutationObserver(injectStyles)
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  onMounted(injectStyles)
  onUnmounted(() => {
    // Clear styles
    inlineStyles.value = []

    // Disconnect observer
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    injectedStyles,
  }
}
