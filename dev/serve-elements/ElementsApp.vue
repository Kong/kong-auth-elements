<template>
  <div class="demo-container">
    <h1>Elements App</h1>

    <div class="shadow-dom-container">
      <!-- Kong Auth Login -->
      <kong-auth-login
        forgot-password-url="https://konnect-dev.konghq.com/login"
      ></kong-auth-login>
    </div>
  </div>
</template>

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

.shadow-dom-container {
  border: 1px dotted #1155cb;
  margin: 20px;

  @media screen and (min-width: 578px) {
    max-width: 600px;
    margin: 20px 20px 20px auto;
  }
}
</style>
