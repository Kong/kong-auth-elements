import { defineCustomElement } from 'vue'
import { registerCustomElement } from '@/utils'
import KongAuthResetPassword from '@/elements/kong-auth-reset-password/KongAuthResetPassword.ce.vue'

/**
 * Registers the custom element.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthResetPassword(tagName = 'kong-auth-reset-password'): void {
  registerCustomElement(tagName, defineCustomElement(KongAuthResetPassword))
}
