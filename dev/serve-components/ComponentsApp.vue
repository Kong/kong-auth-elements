<template>
  <div class="demo-container">
    <h1>Components App</h1>

    <div class="component-container">
      <div v-if="urlPath.includes('/login') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>KongAuthLogin.vue</code>
        </h4>
        <div id="kong-auth-login-wrapper">
          <KongAuthLogin
            wrapper-id="kong-auth-login-wrapper"
            basic-auth-login-enabled
            :idp-login-enabled="true"
            idp-login-return-to="https://kompany795bb6b9.us.portal.konghq.tech"
            show-forgot-password-link
            @login-success="showAlert('Login success!')"
            @click-forgot-password-link="showAlert('User clicked forgot password')"
            @click-register-link="showAlert('User clicked register')"
            @idp-is-loading="showAlert('IDP loading state changed')"
          />
        </div>
      </div>

      <div v-if="urlPath.includes('/forgot-password') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>KongAuthForgotPassword.vue</code>
        </h4>
        <div id="kong-auth-forgot-password-wrapper">
          <KongAuthForgotPassword
            wrapper-id="kong-auth-forgot-password-wrapper"
            instruction-text="Enter your verified email address and we will send you a password reset link."
            @click-login-link="showAlert('User clicked login')"
            @forgot-password-success="showAlert('Forgot password success!')"
          />
        </div>
      </div>

      <div v-if="urlPath.includes('/reset-password') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>KongAuthResetPassword.vue</code>
        </h4>
        <div id="kong-auth-forgot-password-wrapper">
          <KongAuthResetPassword
            wrapper-id="kong-auth-forgot-password-wrapper"
            instruction-text="Please enter in your new password and confirm it below."
            @reset-password-success="showAlert('Reset password success!')"
          />
        </div>
      </div>

      <div v-if="urlPath.includes('/register') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>KongAuthRegister.vue</code>
        </h4>
        <div id="kong-auth-register-wrapper">
          <KongAuthRegister
            access-code-required
            wrapper-id="kong-auth-register-wrapper"
            @register-success="showAlert('Register success!')" />
        </div>
      </div>

      <div v-if="urlPath.includes('/accept-invitation') || urlPath === '/'" class="element-wrapper">
        <h4>
          <code>KongAuthAcceptInvitation.vue</code>
        </h4>
        <div id="kong-auth-accept-invitation-wrapper">
          <KongAuthAcceptInvitation
            wrapper-id="kong-auth-accept-invitation-wrapper"
            subheader-text="This is custom text"
            @accept-invitation-success="showAlert('Accept invitation success!')" />
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
    margin: 10px 0 40px;
    text-align: center;
  }

  .component-container {
    position: relative;
    background: #fff;
    border: 1px dotted #1155cb;
    margin: 20px;
    padding: 40px;

    @media screen and (min-width: 578px) {
      max-width: 400px;
      margin: 40px auto 0;
    }

    .element-wrapper {
      padding-bottom: 20px;
      border-bottom: 1px solid lightgray;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
