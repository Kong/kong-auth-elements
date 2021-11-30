<template>
  <section>
    <div
      class="login d-flex align-items-center justify-content-center flex-column">
      <div class="login-card col-10 col-md-6">
        <KCard has-shadow data-testid="login-form">
          <template v-slot:body>
            <div class="d-flex flex-column mb-5">
              <AppLogo width="180" height="26" />
            </div>
            <div class="login-header type-xxxl mb-5">Login</div>
            <form
              @submit.prevent=""
            >
              <KLabel for="email"> Email </KLabel>
              <input
                id="email"
                class="k-input w-100 mb-5"
                autocomplete="email"
                required
                autofocus="autofocus"
              />

              <KLabel for="password"> Password </KLabel>
              <input
                id="password"
                type="password"
                class="k-input w-100"
                autocomplete="current-password"
                required
              />
              <p class="help mt-3">
                <router-link
                  class="color-blue-500"
                  to="#"
                >
                  Forgot your password?
                </router-link>
              </p>

              <KButton
                appearance="primary"
                class="justify-content-center w-100 type-lg login-button"
                type="submit"
              >Login</KButton>
            </form>
          </template>
        </KCard>
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
  </section>
</template>

<style lang="scss" scoped>
/* KONG_AUTH_INJECT_STYLES */
</style>
