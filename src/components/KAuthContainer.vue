<template>
  <div id="kauth-app-container">
    <nav v-if="routes && routes.length" class="nav">
      <ul>
        <li v-for="route in routes.filter(r => r.meta && r.meta.title && r.name !== '404')" :key="route.name">
          <router-link :to="{ name: route.name }">{{ route.meta!.title || 'no title' }}</router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { inject, Ref, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { routes, isValidRouteName } from '@/router'
import '@kongponents/styles/styles.css'

const router = useRouter()

onBeforeMount(() => {
  // Get initial-view prop from kong-auth custom element
  const initialView: Ref<string> = inject('initialView') || ref('')
  console.log('initialView', initialView.value)

  // If initialView is set and matches a valid route.name, immediately redirect to view
  if (initialView.value && isValidRouteName(initialView.value) && router.currentRoute.value.name !== initialView.value) {
    router.replace({ name: initialView.value })
  }
})
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

.nav {
  ul {
    display: flex;
    list-style: none;
    justify-content: center;
    width: 100%;

    > li {
      display: inline-flex;
      margin-right: 12px;

      &::last-of-type {
        margin-right: none;
      }
    }
  }
}
</style>
