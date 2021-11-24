<template>
  <div class="demo-container">

    <h1>Demo Host App</h1>
    <div class="shadow-dom-border">
      <kong-auth></kong-auth>
    </div>
  </div>
</template>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
}

.demo-container {
  background: #eee;
  padding: 20px;
}

.shadow-dom-border {
  background: #fff;
  border: 1px dotted #1155cb;
  margin: 20px;
}
</style>
