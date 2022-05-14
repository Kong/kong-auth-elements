import { computed, ref, ComputedRef, onMounted, onUnmounted } from 'vue'
import useConfigOptions from '@/composables/useConfigOptions'
interface InjectStylesComposable {
  injectedStyles: ComputedRef<string>
}

export default function useInjectStyles(): InjectStylesComposable {
  const { shadowDom, shadowDomCss } = useConfigOptions()

  const inlineStyles = ref<any>([])
  const injectedStyles = computed((): string => {
    let styles = ''

    if (!shadowDom) return styles

    // If shadow DOM and inlineStyles has value
    if (shadowDom && inlineStyles.value && inlineStyles.value.length) {
      styles += `<style type="text/css">${inlineStyles.value
        .map((styleNode: HTMLElement) => styleNode.innerHTML)
        .join('')}</style>`
    }

    // If an array of CSS links were passed, iterate through array
    if (typeof shadowDomCss === 'object' && shadowDomCss?.length) {
      for (const css in shadowDomCss) {
        // Add to the shadow DOM
        styles += String(shadowDomCss[css]).trim().length && `<style type="text/css" data-testid="shadow-dom-css-${css}">${String(shadowDomCss[css]).trim()}</style>`
      }
    } else if (shadowDomCss && typeof shadowDomCss === 'string') {
      // Provide a fallback in case they passed a CSS link as a string
      // Add to the shadow DOM
      styles += String(shadowDomCss).trim().length && `<style type="text/css" data-testid="shadow-dom-css-0">${String(shadowDomCss).trim()}</style>`
    }

    return styles
  })

  /**
   * Parses <style> tags found in the document.head and filters them based on the given parameters.
   * Then the styles are injected into the element's shadow DOM for consumption.
   */
  const injectStyles = (): void => {
    if (!shadowDom) return

    inlineStyles.value = Array.from(document.head.getElementsByTagName('style'))
      .filter((styleNode) => {
        // Only inject styles if they contain this exact string: "/*! KONG_AUTH_INJECT_STYLES */"
        return (
          styleNode.innerHTML.includes('KONG_AUTH_INJECT_STYLES')
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
