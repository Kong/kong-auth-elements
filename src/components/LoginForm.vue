<template>
  <div class="d-flex align-items-center justify-content-center flex-column">
    <div class="col-10 col-md-6">
      <form class="login-form" @submit.prevent="">
        <KLabel for="email">Email</KLabel>
        <input
          id="email"
          class="k-input w-100 mb-5"
          autocomplete="email"
          required
          autofocus
        />

        <KLabel for="password">Password</KLabel>
        <input
          id="password"
          type="password"
          class="k-input w-100"
          autocomplete="current-password"
          required
        />

        <p v-if="forgotPasswordUrl" class="help my-3">
          <a class="color-blue-500" :href="forgotPasswordUrl">
            Forgot your password?
          </a>
        </p>

        <KButton
          appearance="secondary"
          class="justify-content-center w-100 type-lg login-button"
          type="submit"
          >Button text</KButton
        >
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import KButton from '@kongponents/kbutton'
import KLabel from '@kongponents/klabel'

export default defineComponent({
  name: 'LoginForm',
  components: {
    KButton,
    KLabel,
  },
  setup() {
    const forgotPasswordUrl = inject('forgot-password-url', '')

    return {
      forgotPasswordUrl,
    }
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
</style>
