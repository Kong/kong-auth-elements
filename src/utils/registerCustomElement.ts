import { defineCustomElement } from 'vue'
import { kebabize } from '@/utils'

/**
 * Register a given Vue component as a Custom Element in the DOM.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 * @param {VueComponent} elementComponent - The Vue component.
 */
export default function (
  tagName: string,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  elementComponent,
): void {
  try {
    const customElementName = kebabize(tagName)

    if (!customElementName) {
      throw 'registerCustomElement: You must provide a valid string for the custom element tag name.'
    } else if (!customElementName.includes('-')) {
      throw "registerCustomElement: You must provide a kebab-case string for the custom element tag name. Example: 'my-element'"
    }

    if (!elementComponent) {
      throw 'registerCustomElement: You must provide a valid Vue Element.'
    }

    if (window.customElements.get(customElementName)) {
      throw 'registerCustomElement: Unable to register custom element <kong-auth-login> -- the name has already been registered.'
    }

    customElements.define(
      customElementName,
      defineCustomElement(elementComponent),
    )
  } catch (err) {
    console.error(err)
  }
}
