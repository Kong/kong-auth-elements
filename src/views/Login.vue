<template>
  <div class="view-login">
    <h1>Login</h1>
    <div class="d-flex align-items-center justify-content-center flex-column">
      <div class="col-10 col-md-6">
        <form @submit.prevent="">
          <KLabel for="email"> Email *</KLabel>
          <input
            id="email"
            class="k-input w-100 mb-5"
            autocomplete="email"
            required
            autofocus
          />

          <KLabel for="password"> Password *</KLabel>
          <input
            id="password"
            type="password"
            class="k-input w-100"
            autocomplete="current-password"
            required
          />
          <p class="help mt-3">
            <router-link class="color-blue-500" to="/forgot-password">
              Forgot your password?
            </router-link>
          </p>

          <KButton
            appearance="primary"
            class="justify-content-center w-100 type-lg login-button"
            type="submit"
            >Login</KButton
          >
        </form>
      </div>

      <div class="register-link text-center">
        <p class="color-black-50 bolder">
          Don't have an account?
          <router-link class="color-blue-500" to="#">
            Sign Up &rarr;
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* KONG_AUTH_INJECT_STYLES */
</style>
