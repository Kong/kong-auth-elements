import { defineCustomElement, provide, h, VueElementConstructor } from 'vue'
import { kebabize, KongAuthElementsOptions } from '@/utils'

/**
 * Register a given Vue component as a Custom Element in the DOM.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 * @param {VueComponent} customElementComponent - The Vue component.
 */
export default function(
  tagName: string,
  // customElementComponent: VueElementConstructor<Record<string, unknown>>,
  customElementComponent: VueElementConstructor<any>,
  options?: KongAuthElementsOptions,
): void {
  try {
    const customElementName = kebabize(tagName)

    if (!customElementName) {
      throw new Error('registerCustomElement: You must provide a valid string for the custom element tag name.')
    } else if (!customElementName.includes('-')) {
      throw new Error("registerCustomElement: You must provide a kebab-case string for the custom element tag name. Example: 'my-element'")
    }

    if (!customElementComponent) {
      throw new Error('registerCustomElement: You must provide a valid Vue Element.')
    }

    if (window.customElements.get(customElementName)) {
      throw new Error('registerCustomElement: Unable to register custom element <kong-auth-login> -- the name has already been registered.')
    }

    const vueCustomElement = defineCustomElement({
      ...customElementComponent,
      setup(props) {
        // Provide option values to components
        provide('kauth-api-base-url', options?.apiBaseUrl)
        provide('developers', options?.developers || false)
        provide('shadow-dom', options?.shadowDom || false)

        // Render component
        return () => h(customElementComponent, props)
      },
    })

    customElements.define(customElementName, vueCustomElement)
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err?.message)
  }
}
