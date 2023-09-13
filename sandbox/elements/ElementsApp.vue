<template>
  <SharedLayout type="elements">
    <div v-if="route.name === 'login'" class="element-wrapper">
      <h4>
        <code>kong-auth-login</code>
      </h4>
      <div id="kong-auth-login-wrapper">
        <kong-auth-login
          .basic-auth-login-enabled="true"
          .idp-login-enabled="true"
          idp-login-return-to="https://cloud.konghq.tech/"
          instruction-text="This is the instruction text"
          show-forgot-password-link
          wrapper-id="kong-auth-login-wrapper"
          @click-forgot-password-link="showAlert('User clicked forgot password')"
          @click-register-link="showAlert('User clicked register')"
          @idp-is-loading="showAlert('IDP loading state changed')"
          @login-success="showAlert('Login success!')"
          @verify-email-success="showAlert('User verified email')"
        />
      </div>
    </div>

    <div v-if="route.name === 'forgot-password'" class="element-wrapper">
      <h4>
        <code>kong-auth-forgot-password</code>
      </h4>
      <div id="kong-auth-forgot-password-wrapper">
        <kong-auth-forgot-password
          instruction-text="Enter your verified email address and we will send you a password reset link."
          show-login-link
          wrapper-id="kong-auth-forgot-password-wrapper"
          @click-login-link="showAlert('User clicked login')"
          @forgot-password-success="showAlert('Forgot password success!')"
        />
      </div>
    </div>

    <div v-if="route.name === 'reset-password'" class="element-wrapper">
      <h4>
        <code>kong-auth-reset-password</code>
      </h4>
      <div id="kong-auth-reset-password-wrapper">
        <kong-auth-reset-password
          instruction-text="Please enter in your new password and confirm it below."
          wrapper-id="kong-auth-reset-password-wrapper"
          @reset-password-success="showAlert('Reset password success!')"
        />
      </div>
    </div>

    <div v-if="route.name === 'change-password'" class="element-wrapper">
      <h4>
        <code>kong-auth-change-password</code>
      </h4>
      <div id="kong-auth-change-password-wrapper">
        <kong-auth-change-password
          instruction-text="Please enter in your current password, new password and confirm it below."
          wrapper-id="kong-auth-change-password-wrapper"
          @change-password-success="showAlert('Change password success!')"
          @password-requirements="showAlert('New password inputted')"
        />
      </div>
    </div>

    <div v-if="route.name === 'register'" class="element-wrapper">
      <h4>
        <code>KongAuthRegister.vue</code>
      </h4>
      <div id="kong-auth-register-wrapper">
        <kong-auth-register
          access-code-required
          wrapper-id="kong-auth-register-wrapper"
          @register-success="showAlert('Register success!')" />
      </div>
    </div>

    <div v-if="route.name === 'accept-invitation'" class="element-wrapper">
      <h4>
        <code>KongAuthAcceptInvitation.vue</code>
      </h4>
      <div id="kong-auth-accept-invitation-wrapper">
        <kong-auth-accept-invitation
          wrapper-id="kong-auth-accept-invitation-wrapper"
          @accept-invitation-success="showAlert('Accept invitation success!')" />
      </div>
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
</script>
