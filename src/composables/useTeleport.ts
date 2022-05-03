import { ref, computed, onMounted } from 'vue'

/**
 * @description Utlize Vue Teleport to move custom elements out of the shadow DOM
 * @param {props} elementProps Custom Element component props
 */
export default function useTeleport(elementProps: Record<string, any>) {
  /**
   * Transform a given string into an element selector
   * @param {string} selector - The string to transform
   * @returns {string} HTML id selector
   */
  const getTeleportSelector = (selector: string): string => {
    if (!selector || selector.trim() === '') {
      return ''
    }

    return '#' + selector.trim().replace(/[^a-z0-9-_]/gi, '')
  }

  // The HTML selector to teleport the custom element to
  const teleportSelector = computed((): string => getTeleportSelector(elementProps.wrapperId))

  // Should the teleport be disabled
  const disableTeleport = ref(!elementProps.shouldTeleport || false)

  // Always called in the onMounted function, this allows the element to render
  const shouldRender = ref(false)

  onMounted(() => {
    // Check if element props.wrapperId exists in the DOM
    if (!document.querySelector(teleportSelector.value)) {
      // Disable the Teleport component and just render in the shadow DOM
      disableTeleport.value = true

      console.error(`Could not teleport kong-auth-element out of shadow DOM. Element with id="${teleportSelector.value.replace(/#/g, '')}" was not found`)
    }

    // Always set to true so the element renders, regardless of whether we are disabling the teleport functionality
    shouldRender.value = true
  })

  return {
    teleportSelector,
    disableTeleport,
    shouldRender,
  }
}
