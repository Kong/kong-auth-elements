<template>
  <div class="kauth-app-wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts">
import '@kongponents/styles/styles.css'
</script>

<style lang="scss">
/* KONG_AUTH_INJECT_STYLES */

// Import custom app styles from a single entrypoint
// (since this is wrapping all custom elements)
@import '@/assets/styles/app.scss';

.kauth-app-wrapper {
  font-family: 'Maison Neue', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style>
