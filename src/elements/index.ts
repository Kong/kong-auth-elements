import { defineCustomElement } from 'vue'
import { registerCustomElement } from '@/utils'
// Import elements
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'
import KongAuthResetPassword from '@/elements/kong-auth-reset-password/KongAuthResetPassword.ce.vue'

/**
 * Registers the KongAuthForgotPassword custom element.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthForgotPassword(tagName = 'kong-auth-forgot-password'): void {
  registerCustomElement(tagName, defineCustomElement(KongAuthForgotPassword))
}

/**
 * Registers the KongAuthLogin custom element.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthLogin(tagName = 'kong-auth-login'): void {
  registerCustomElement(tagName, defineCustomElement(KongAuthLogin))
}

/**
 * Registers the KongAuthRegister custom element.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthRegister(tagName = 'kong-auth-register'): void {
  registerCustomElement(tagName, defineCustomElement(KongAuthRegister))
}

/**
 * Registers the KongAuthResetPassword custom element.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthResetPassword(tagName = 'kong-auth-reset-password'): void {
  registerCustomElement(tagName, defineCustomElement(KongAuthResetPassword))
}
