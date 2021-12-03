import { registerCustomElement } from '@/utils'
import KongAuthForgotPassword from '@/elements/kong-auth-forgot-password/KongAuthForgotPassword.ce.vue'

/**
 * Registers the KongAuthForgotPassword element.
 * @param {string} [tagName=kong-auth-forgot-password] - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthForgotPassword (
  tagName = 'kong-auth-forgot-password',
): void {
  registerCustomElement(tagName, KongAuthForgotPassword)
}
