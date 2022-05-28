<template>
  <div class="demo-container">
    <h1>Elements App</h1>

    <div class="component-container">
      <div v-if="urlPath.includes('/login') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>kong-auth-login</code>
        </h4>
        <div id="kong-auth-login-wrapper">
          <kong-auth-login
            wrapper-id="kong-auth-login-wrapper"
            :basicAuthLoginEnabled="true"
            idp-login-enabled
            idp-login-return-to="https://hydrogen.ephemeral.konnect-dev.konghq.com/"
            show-forgot-password-link
            @login-success="showAlert('Login success!')"
            @click-forgot-password-link="showAlert('User clicked forgot password')"
            @click-register-link="showAlert('User clicked register')"
            @verify-email-success="showAlert('User verified email')"
            @idp-is-loading="showAlert('IDP loading state changed')"
          />
        </div>
      </div>

      <div v-if="urlPath.includes('/forgot-password') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>kong-auth-forgot-password</code>
        </h4>
        <div id="kong-auth-forgot-password-wrapper">
          <kong-auth-forgot-password
            wrapper-id="kong-auth-forgot-password-wrapper"
            instruction-text="Enter your verified email address and we will send you a password reset link."
            @click-login-link="showAlert('User clicked login')"
            @forgot-password-success="showAlert('Forgot password success!')"
          />
        </div>
      </div>

      <div v-if="urlPath.includes('/reset-password') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>kong-auth-reset-password</code>
        </h4>
        <div id="kong-auth-reset-password-wrapper">
          <kong-auth-reset-password
            wrapper-id="kong-auth-reset-password-wrapper"
            instruction-text="Please enter in your new password and confirm it below."
            @reset-password-success="showAlert('Reset password success!')"
            show-password-strength-meter
          />
        </div>
      </div>

      <div v-if="urlPath.includes('/register') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>KongAuthRegister.vue</code>
        </h4>
        <div id="kong-auth-register-wrapper">
          <kong-auth-register
            wrapper-id="kong-auth-register-wrapper"
            show-password-strength-meter
            @register-success="showAlert('Register success!')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { win } from '@/utils'

const showAlert = (text = ''): void => {
  if (!text) {
    return
  }
  alert(text)
}

const urlPath = ref('')

onMounted(() => {
  urlPath.value = win.getLocationPathname()
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
    position: relative;
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
