import { VueElementConstructor } from 'vue'
import { kebabize } from '@/utils'

/**
 * Register a given Vue component as a Custom Element in the DOM.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 * @param {VueComponent} customElementComponent - The Vue component.
 */
export default function (
  tagName: string,
  customElementComponent: VueElementConstructor<Record<string, unknown>>,
): void {
  try {
    const customElementName = kebabize(tagName)

    if (!customElementName) {
      throw 'registerCustomElement: You must provide a valid string for the custom element tag name.'
    } else if (!customElementName.includes('-')) {
      throw "registerCustomElement: You must provide a kebab-case string for the custom element tag name. Example: 'my-element'"
    }

    if (!customElementComponent) {
      throw 'registerCustomElement: You must provide a valid Vue Element.'
    }

    if (window.customElements.get(customElementName)) {
      throw 'registerCustomElement: Unable to register custom element <kong-auth-login> -- the name has already been registered.'
    }

    customElements.define(customElementName, customElementComponent)
  } catch (err) {
    console.warn(err)
  }
}
