<template>
  <div class="demo-container">
    <h1>Elements App</h1>

    <div class="component-container">
      <h4><code>kong-auth-login</code></h4>
      <kong-auth-login
        show-forgot-password-link
        @login-success="showAlert('Login success!')"
        @click-forgot-password-link="showAlert('User clicked forgot password')"
        @click-register-link="showAlert('User clicked register')"></kong-auth-login>
      <hr />

      <h4><code>kong-auth-forgot-password</code></h4>
      <kong-auth-forgot-password
        instruction-text="Enter your verified email address and we will send you a password reset link."
        @click-login-link="showAlert('User clicked login')"
        @forgot-password-success="showAlert('Forgot password success!')"></kong-auth-forgot-password>
      <hr />

      <h4><code>kong-auth-reset-password</code></h4>
      <kong-auth-reset-password
        @reset-password-success="showAlert('Reset password success!')"></kong-auth-reset-password>
      <hr />

      <h4><code>KongAuthRegister.vue</code></h4>
      <kong-auth-register @register-success="showAlert('Register success!')" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
