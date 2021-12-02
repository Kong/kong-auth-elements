<template>
  <KAuthWrapper>
    <div class="d-flex align-items-center justify-content-center flex-column">
      <div class="col-10 col-md-6">
        <form @submit.prevent="">
          <KLabel for="email"> Email </KLabel>
          <input
            id="email"
            class="k-input w-100 mb-5"
            autocomplete="email"
            required
            autofocus
          />

          <KLabel for="password"> Password </KLabel>
          <input
            id="password"
            type="password"
            class="k-input w-100"
            autocomplete="current-password"
            required
          />

          <p v-if="$props.forgotPasswordUrl" class="help my-3">
            <a class="color-blue-500" :href="$props.forgotPasswordUrl">
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
  </KAuthWrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KAuthWrapper from '@/components/KAuthWrapper.vue'
import KButton from '@kongponents/kbutton'
import KLabel from '@kongponents/klabel'

export default defineComponent({
  name: 'KAuthLogin',
  // Props are defined here for use on the custom element tag
  // These values are then provided within utils/defineCustomKongElement.ts
  props: {
    forgotPasswordUrl: String,
  },
  components: {
    KAuthWrapper,
    KButton,
    KLabel,
  },
})
</script>

<style lang="scss">
/* KONG_AUTH_INJECT_STYLES */
</style>
