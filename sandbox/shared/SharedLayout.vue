<template>
  <h1>{{ type === 'components' ? 'Components' : 'Elements' }} App</h1>
  <div class="demo-container">
    <div class="nav-container">
      <AppNav />
    </div>

    <div class="component-container">
      <slot name="default" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import AppNav from '../shared/AppNav.vue'

defineProps({
  type: {
    type: String as PropType<'components' | 'elements'>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}

.demo-container {
  padding: 20px;

  @media (min-width: 768px) {
    display: flex;
  }

  .nav-container {
    margin-bottom: 20px;

    @media (min-width: 768px) {
      width: 240px;
    }
  }

  h1,
  h4,
  :deep(h4) {
    margin: 10px 0 40px;
    text-align: center;
  }

  .component-container {
    position: relative;
    background: #fff;
    padding: 40px;
    width: 100%;

    :deep(.element-wrapper) {
      @media (min-width: 768px) {
        max-width: 400px;
        margin: auto;
      }

      .kong-auth-element {
        border: 1px dotted #1155cb;
      }
    }
  }
}
</style>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  background: #eee;
}
</style>
