<template>
  <div class="demo-container">
    <h1>Elements App</h1>

    <div class="component-container">
      <div v-if="urlPath.includes('/login') || urlPath === '/'" class="element-wrapper">
        <h4><code>kong-auth-login</code></h4>
        <kong-auth-login
          show-forgot-password-link
          @login-success="showAlert('Login success!')"
          @click-forgot-password-link="showAlert('User clicked forgot password')"
          @click-register-link="showAlert('User clicked register')"
          @confirm-email-success="showAlert('User confirmed email')"></kong-auth-login>
      </div>

      <div v-if="urlPath.includes('/forgot-password') || urlPath === '/'" class="element-wrapper">
        <h4><code>kong-auth-forgot-password</code></h4>
        <kong-auth-forgot-password
          instruction-text="Enter your verified email address and we will send you a password reset link."
          @click-login-link="showAlert('User clicked login')"
          @forgot-password-success="showAlert('Forgot password success!')"></kong-auth-forgot-password>
      </div>

      <div v-if="urlPath.includes('/reset-password') || urlPath === '/'" class="element-wrapper">
        <h4><code>kong-auth-reset-password</code></h4>
        <kong-auth-reset-password
          instruction-text="Please enter in your new password and confirm it below."
          @reset-password-success="showAlert('Reset password success!')"></kong-auth-reset-password>
      </div>

      <div v-if="urlPath.includes('/register') || urlPath === '/'" class="element-wrapper">
        <h4><code>KongAuthRegister.vue</code></h4>
        <kong-auth-register @register-success="showAlert('Register success!')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showAlert = (text = ''): void => {
  if (!text) {
    return
  }
  alert(text)
}

const urlPath = ref('')

onMounted(() => {
  urlPath.value = window.location.pathname
})
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

    .element-wrapper {
      border-bottom: 1px solid lightgray;
      padding: 40px 0;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
