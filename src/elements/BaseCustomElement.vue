<template>
  <!-- This injected styles tag and its corresponding logic in the setup function must be present to import styles from child components. -->
  <div v-if="injectedStyles" v-html="injectedStyles"></div>
  <slot />
</template>

<script setup lang="ts">
import useInjectStyles from '@/composables/useInjectStyles'
import '@kongponents/styles/styles.css'

// Must be present to inject child component styles for
// elements rendered inside of the KAuthWrapper <slot/>
const { injectedStyles } = useInjectStyles()
</script>

<style lang="scss">
/*! KONG_AUTH_INJECT_STYLES */

// Do not add the 'scoped' attribute to the <style> tag in this component.

// Import custom app styles from a single entrypoint
// (since this is wrapping all custom elements)
@import '@/assets/styles/app.scss';
</style>
