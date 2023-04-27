<template>
  <SharedLayout type="components">
    <div v-if="route.name === 'login'" class="element-wrapper">
      <h4>
        <code>KongAuthLogin.vue</code>
      </h4>
      <KongAuthLogin
        basic-auth-login-enabled
        idp-login-enabled
        idp-login-return-to="https://kompany795bb6b9.us.portal.konghq.tech"
        show-forgot-password-link
        @click-forgot-password-link="showAlert('User clicked forgot password')"
        @click-register-link="showAlert('User clicked register')"
        @idp-is-loading="showAlert('IDP loading state changed')"
        @login-success="showAlert('Login success!')"
      />
    </div>

    <div v-if="route.name === 'forgot-password'" class="element-wrapper">
      <h4>
        <code>KongAuthForgotPassword.vue</code>
      </h4>
      <KongAuthForgotPassword
        instruction-text="Enter your verified email address and we will send you a password reset link."
        wrapper-id="kong-auth-forgot-password-wrapper"
        @click-login-link="showAlert('User clicked login')"
        @forgot-password-success="showAlert('Forgot password success!')"
      />
    </div>

    <div v-if="route.name === 'reset-password'" class="element-wrapper">
      <h4>
        <code>KongAuthResetPassword.vue</code>
      </h4>
      <KongAuthResetPassword
        instruction-text="Please enter in your new password and confirm it below."
        wrapper-id="kong-auth-forgot-password-wrapper"
        @reset-password-success="showAlert('Reset password success!')"
      />
    </div>

    <div v-if="route.name === 'change-password'" class="element-wrapper">
      <h4>
        <code>KongAuthChangePassword.vue</code>
      </h4>
      <KongAuthChangePassword
        instruction-text="Please enter in your current password, new password and confirm it below."
        wrapper-id="kong-auth-change-password-wrapper"
        @change-password-success="showAlert('Change password success!')"
        @password-requirements="logMessage('New password inputted')"
      />
    </div>

    <div v-if="route.name === 'register'" class="element-wrapper">
      <h4>
        <code>KongAuthRegister.vue</code>
      </h4>
      <KongAuthRegister
        access-code-required
        recaptcha
        wrapper-id="kong-auth-register-wrapper"
        @register-success="showAlert('Register success!')" />
    </div>

    <div v-if="route.name === 'accept-invitation'" class="element-wrapper">
      <h4>
        <code>KongAuthAcceptInvitation.vue</code>
      </h4>
      <KongAuthAcceptInvitation
        subheader-text="This is custom text"
        wrapper-id="kong-auth-accept-invitation-wrapper"
        @accept-invitation-success="showAlert('Accept invitation success!')" />
    </div>
  </SharedLayout>
</template>

<script setup lang="ts">
import SharedLayout from '../shared/SharedLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showAlert = (text = ''): void => {
  if (!text) {
    return
  }
  alert(text)
}

const logMessage = (text = ''): void => {
  if (!text) {
    return
  }
  console.log(text)
}
</script>
