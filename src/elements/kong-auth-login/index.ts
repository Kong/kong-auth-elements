import { registerCustomElement } from '@/utils'
import KongAuthLogin from '@/elements/kong-auth-login/KongAuthLogin.ce.vue'

/**
 * Registers the KongAuthLogin element.
 * @param {string} [tagName=kong-auth-login] - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthLoginElement (
  tagName = 'kong-auth-login',
): void {
  registerCustomElement(tagName, KongAuthLogin)
}
