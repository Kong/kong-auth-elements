<template>
  <nav class="app-nav">
    <ul>
      <li
        v-for="routeName in routes"
        :key="routeName"
      >
        <router-link :to="{ name: routeName }">
          <span>{{ routeName }}</span>
          <span v-if="route.name === routeName">&rsaquo;</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const routes = [
  'login',
  'forgot-password',
  'reset-password',
  'change-password',
  'register',
  'accept-invitation',
]

const route = useRoute()
</script>

<style lang="scss">
$blue: #1155cb;
$green: #07a88d;

.app-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  border: 1px solid darken($blue, 20%);

  ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;

    li {
      border-bottom: 1px solid darken($blue, 20%);
      font-size: 16px;

      &:last-of-type {
        border-bottom: 0;
      }

      a {
        border-bottom: 1px solid transparent;
        color: #fff;
        background-color: $blue;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        text-decoration: none;
        transition: all .2s ease-in-out;

        &:hover {
          background-color: darken($blue, 10%);
        }

        &.router-link-active {
          background-color: $green;

          &:hover {
            cursor: default;
          }
        }

        > span {
          display: block;
        }
      }
    }
  }
}
</style>
