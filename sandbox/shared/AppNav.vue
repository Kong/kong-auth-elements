<template>
  <nav class="app-nav">
    <ul>
      <li v-for="route in routes" :key="route">
        <router-link :to="{ name: route }">{{ route }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const routes = [
  'login',
  'forgot-password',
  'reset-password',
  'change-password',
  'register',
  'accept-invitation',
]
</script>

<style lang="scss">
.app-nav {
  display: flex;
  justify-content: center;

  ul {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
    margin: 0;

    li {
      display: block;

      a {
        border-bottom: 1px solid transparent;
        color: var(--blue-500, blue);
        text-decoration: none;
        transition: all .2s ease-in-out;

        &:hover {
          border-bottom-color: var(--blue-500, blue);
        }

        &.router-link-active {
          color: var(--green-500, green);

          &:hover {
            border-bottom-color: var(--green-500, green);
          }
        }
      }
    }
  }
}
</style>
