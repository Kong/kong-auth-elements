<template>
  <div class="demo-container">
    <h1>Components App</h1>

    <div class="component-container">
      <h4><code>KongAuthLogin.vue</code></h4>
      <KongAuthLogin
        forgot-password-url="https://konnect-dev.konghq.com/forgot-password"
        register-url="https://konnect-dev.konghq.com/register"></KongAuthLogin>

      <hr />

      <h4><code>KongAuthForgotPassword.vue</code></h4>
      <KongAuthForgotPassword
        login-url="https://konnect-dev.konghq.com/login" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Import and register Custom Elements as Components
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  background: #eee;
}

.demo-container {
  padding: 20px;

  h1,
  h4 {
    margin: 10px 0;
    text-align: center;
  }

  .component-container {
    background: #fff;
    border: 1px dotted #1155cb;
    margin: 20px;
    padding: 20px;

    @media screen and (min-width: 578px) {
      max-width: 600px;
      margin: 40px auto 0;
    }

    hr {
      margin: 40px 0;
    }
  }
}
</style>
