<template>
  <div class="Password component-password-strength-meter">
    <div v-if="showStrengthMeter" :class="[strengthMeterClass]">
      <div :class="[strengthMeterFillClass]" :data-score="passwordStrength"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import zxcvbn from 'zxcvbn'

export default defineComponent({
  name: 'PasswordStrengthMeter',
  inheritAttrs: false,
  emits: ['input', 'focus', 'blur', 'score', 'feedback', 'hide', 'show'],
  props: {
    /**
       * Binded value
       * @type {Object}
       */
    modelValue: {
      type: String,
    },
    /**
       * Password min length.
       * Right now only visual for the badge
       * @type {Number}
       */
    secureLength: {
      type: Number,
      default: 7,
    },
    /**
       * Prop to toggle the
       * strength Meter if
       * User wants to implement
       * their own
       */
    showStrengthMeter: {
      type: Boolean,
      default: true,
    },
    /**
       * CSS class for styling the
       * strength meter bars.
       * @type {String}
       */
    strengthMeterClass: {
      type: String,
      default: 'Password__strength-meter',
    },
    /**
       * strengthMeterFillClass sets the
       * individual strength width and fill
       * color of the strength meter bars.
       * @type {String}
       */
    strengthMeterFillClass: {
      type: String,
      default: 'Password__strength-meter--fill',
    },
    /**
       * @type String
       */
    userInputs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      password: null,
      shouldShowPassword: false,
    }
  },

  methods: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    emitValue(type, value, convertEvent = false) {
      let newVal = value

      // Check for passing an event
      if (convertEvent) {
        newVal = value.target.value
      }
      this.$emit(type, newVal)
      this.password = newVal
    },
  },

  computed: {
    /**
     * passwordStrength is the score calculated by zxcvbn
     * @return {Number} Password Strength Score
     */
    passwordStrength() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.password ? zxcvbn(this.password, (this.userInputs.length >= 1 ? this.userInputs : null)).score : null
    },

    /**
     * isSecure checks if the length of the password is longer then
     * the defined `secureLength`
     * @return {Boolean} Password length longer then minLength
     */
    isSecure() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.password ? this.password.length >= this.secureLength : null
    },

    /**
     * passwordCount holds the character count of the
     * current password. It shows the count up to the `secureLength`.
     * @return {Number} Password Character Count
     */
    passwordCount() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.password && (this.password.length > this.secureLength ? `${this.secureLength}+` : this.password.length)
    },
  },

  watch: {
    modelValue(newValue) {
      this.emitValue('input', newValue)
      this.$emit('feedback', zxcvbn(newValue).feedback)
    },
    passwordStrength(score) {
      this.$emit('score', score)
    },
  },
})
</script>

<style lang="scss" scoped>
/*! KONG_AUTH_INJECT_STYLES */
// No styles should be added to this component; add styles to the /assets/styles/_elements.scss partial
@import "@/assets/styles/elements";
</style>
