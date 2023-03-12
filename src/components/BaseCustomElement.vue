<template>
  <div class="kong-auth-element">
    <div v-if="injectedStyles" data-testid="kong-auth-injected-styles">
      <!-- This injected styles tag, the parent tag, and its corresponding logic in the setup function must be present to import styles from child components. -->
      <div v-html="injectedStyles"></div>
    </div>

    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
import useInjectStyles from '@/composables/useInjectStyles'

// Must be present to inject child component styles for elements rendered inside of the <slot/>
const { injectedStyles } = useInjectStyles()
</script>

<style lang="scss">
/*! KONG_AUTH_INJECT_STYLES */
// Do not add the 'scoped' attribute to this <style> tag in this component.

// Import custom app styles from a single entrypoint
// (since this is wrapping all custom elements)
@import "@/assets/styles/app";

:root {
  --font-family-sans: var(
    --KongAuthFontFamily,
    "Maison Neue",
    "Roboto",
    "Helvetica",
    "Arial",
    sans-serif
  );
}
</style>
