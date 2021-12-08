<template>
  <div class="demo-container">
    <h1>Components App</h1>

    <div class="component-container">
      <h4><code>KongAuthLogin.vue</code></h4>
      <KongAuthLogin
        show-forgot-password-link
        @login-success="showAlert('Login success!')"
        @click-forgot-password-link="showAlert('User clicked forgot password')"
        @click-register-link="showAlert('User clicked register')"></KongAuthLogin>
      <hr />

      <h4><code>KongAuthForgotPassword.vue</code></h4>
      <KongAuthForgotPassword
        instruction-text="Enter your verified email address and we will send you a password reset link."
        @click-login-link="showAlert('User clicked login')"
        @forgot-password-success="showAlert('Forgot password success!')" />
      <hr />

      <h4><code>KongAuthRegister.vue</code></h4>
      <KongAuthRegister @register-success="showAlert('Register success!')" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Import and register Custom Elements as Components
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'

const showAlert = (text = ''): void => {
  if (!text) {
    return
  }
  alert(text)
}
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
