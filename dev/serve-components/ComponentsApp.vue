<template>
  <div class="demo-container">
    <h1>Components App</h1>

    <div class="component-container">
      <!-- Kong Auth Login -->
      <KongAuthLogin
        forgot-password-url="https://konnect-dev.konghq.com/login"
      ></KongAuthLogin>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import and register Custom Elements as Components
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}

.demo-container {
  background: #eee;
  padding: 20px;
}

.component-container {
  border: 1px dotted #1155cb;
  margin: 20px;

  @media screen and (min-width: 578px) {
    max-width: 600px;
    margin: 20px 20px 20px auto;
  }
}
</style>
