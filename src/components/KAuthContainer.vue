<template>
  <div id="kauth-app-container">
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import '@kongponents/styles/styles.css'
</script>

<style lang="scss">
/* KONG_AUTH_INJECT_STYLES */

// Import custom styles from a single entrypoint
@import '@/assets/styles/app.scss';

#kauth-app-container {
  font-family: 'Maison Neue', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style>
