<template>
  <div class="demo-container">
    <div class="nav-container">
      <AppNav />
    </div>

    <div class="component-container">
      <h1>{{ title }}</h1>
      <slot name="default" />

      <p class="component-note">
        <small>Note: The dotted blue border outlines the rendered component area.</small>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import AppNav from '../shared/AppNav.vue'

const props = defineProps({
  type: {
    type: String as PropType<'components' | 'elements'>,
    required: true,
  },
})

const title = computed((): string => `${props.type === 'components' ? 'Components' : 'Elements'} App`)
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.demo-container {
  padding: 20px;

  @media (min-width: 768px) {
    display: flex;
    gap: 16px;
  }

  .nav-container {
    margin-bottom: 20px;

    @media (min-width: 768px) {
      width: 300px;
    }
  }

  h1,
  h4,
  :deep(h4) {
    margin: 0 0 40px;
    text-align: center;
  }

  .component-container {
    position: relative;
    background: #fff;
    padding: 20px;

    @media (min-width: 768px) {
      width: 100%;
    }

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

.component-note {
  font-size: 14px;
  font-style: italic;
  border-top: 1px solid #eee;
  margin: 40px 0 0;
  padding-top: 20px;
  text-align: center;
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
