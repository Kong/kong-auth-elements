import { defineCustomElement } from 'vue'
import { registerCustomElement } from '@/utils'
import KongAuthRegister from '@/elements/kong-auth-register/KongAuthRegister.ce.vue'

/**
 * Registers the custom element.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 */
export function registerKongAuthRegister (tagName = 'kong-auth-register'): void {
  registerCustomElement(tagName, defineCustomElement(KongAuthRegister))
}
