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
       * Display badge:
       * The badge shows your
       * password character count
       * up to the defined secureLength
       * @type {Boolean}
       */
    badge: {
      type: Boolean,
      default: true,
    },
    /**
       * Show password toggle:
       * Show icon to toggle
       * the password visibility
       */
    toggle: {
      type: Boolean,
      default: false,
    },
    /**
       * Prop to toggle the
       * cleartext password if
       * toggle is disabled
       */
    showPassword: {
      type: Boolean,
      default: false,
    },
    /**
      * Prop to change the
      * ref of the input
      */
    referenceValue: {
      type: String,
      default: 'input',
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
       * Prop to toggle the
       * input element if
       * User wants to implement
       * their own input element
       */
    strengthMeterOnly: {
      type: Boolean,
      default: false,
    },
    /**
       * CSS Class for the Input field
       * @type {String}
       */
    defaultClass: {
      type: String,
      default: 'Password__field',
    },
    /**
       * CSS Class for the disabled Input field
       * @type {String}
       */
    disabledClass: {
      type: String,
      default: 'Password__field--disabled',
    },
    /**
       * CSS Class for the badge
       * if a password does not match
       * the secureLength. Later for errors
       * @type {String}
       */
    errorClass: {
      type: String,
      default: 'Password__badge--error',
    },
    /**
       * CSS Class for the badge
       * if a password does match
       * the secureLength. Later for
       * success messages possible.
       * @type {String}
       */
    successClass: {
      type: String,
      default: 'Password__badge--success',
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
       * Label for the show password icon
       */
    labelShow: {
      type: String,
      default: 'Show Password',
    },
    /**
       * Label for the hide password icon
       */
    labelHide: {
      type: String,
      default: 'Hide Password',
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
    togglePassword() {
      if (this.shouldShowPassword) {
        this.$emit('hide')
        this.shouldShowPassword = false
      } else {
        this.$emit('show')
        this.shouldShowPassword = true
      }
    },
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
       * isActive checks if a password is entered.
       * It's required for the password count badge.
       * @return {Boolean} Password entered
       */
    isActive() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.password && this.password.length > 0
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
    /**
       * Changing the input type from password to text
       * based on the local shouldShowPassword data or the showPassword prop
       */
    inputType() {
      return this.shouldShowPassword || this.showPassword ? 'text' : 'password'
    },

    showPasswordLabel() {
      return this.shouldShowPassword || this.showPassword ? this.labelHide : this.labelShow
    },
  },

  watch: {
    modelValue(newValue) {
      if (this.strengthMeterOnly) {
        this.emitValue('input', newValue)
      }
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
