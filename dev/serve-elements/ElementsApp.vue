<template>
  <div class="demo-container">
    <h1>Elements App</h1>

    <div class="component-container">
      <h4><code>kong-auth-login</code></h4>
      <kong-auth-login
        forgot-password-url="https://konnect.konghq.com/forgot-password"
        register-url="https://konnect-dev.konghq.com/register"></kong-auth-login>

      <hr />

      <h4><code>kong-auth-forgot-password</code></h4>
      <kong-auth-forgot-password
        login-url="https://konnect-dev.konghq.com/login"></kong-auth-forgot-password>
    </div>
  </div>
</template>

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
