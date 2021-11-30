<template>
  <div id="kauth-app-container">
    <nav id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import '@kongponents/styles/styles.css'
</script>

<style lang="scss" scoped>
#kauth-app-container {
  font-family: 'Maison Neue', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  #nav {
    text-align: center;
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>

<style lang="scss">
// Import custom styles from a single entrypoint
@import '@/assets/styles/app.scss';
</style>
