<template>
  <div class="demo-container">
    <h1>Elements App</h1>

    <div class="component-container">
      <h4><code>kong-auth-login</code></h4>
      <kong-auth-login
        show-forgot-password-link
        @login-success="onLoginSuccess"
        @click-forgot-password-link="onUserClickForgotPassword"
        @click-register-link="onUserClickRegister"></kong-auth-login>

      <hr />

      <h4><code>kong-auth-forgot-password</code></h4>
      <kong-auth-forgot-password
        instruction-text="Enter your verified email address and we will send you a password reset link."
        @click-login-link="onUserClickLogin"></kong-auth-forgot-password>
    </div>
  </div>
</template>

<script setup lang="ts">
const onUserClickForgotPassword = (): void => {
  alert('User clicked forgot password')
}

const onUserClickRegister = (): void => {
  alert('User clicked register')
}

const onLoginSuccess = async () => {
  alert('User logged in!')
}

const onUserClickLogin = (): void => {
  alert('User clicked login')
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
