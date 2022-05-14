import { defineCustomElement, mergeProps } from 'vue'
import { kebabize } from './index'
import type { KongAuthElementsOptions } from './index'
import appStyles from '../assets/styles/app.scss'

/**
 * Register a given Vue component as a Custom Element in the DOM.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 * @param {VueComponent} customElementComponent - The Vue component.
 * @param {KongAuthElementsOptions} options - Consuming app config options
 * @param {boolean} useShadowDom - Should elements be rendered in a shadow DOM (Pass false to teleport elements out of the shadow DOM for password manager support)
 */
export default function(
  tagName: string,
  customElementComponent: any,
  options?: KongAuthElementsOptions,
  teleportFromShadowDom = true,
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
      throw new Error(`registerCustomElement: Unable to register custom element <${customElementName}> -- the name has already been registered.`)
    }

    // Add a custom prop to teleport the custom element out of the shadow DOM and merge it with the existing props
    const customElementProps = mergeProps({ ...customElementComponent.props }, {
      shouldTeleport: {
        type: Boolean,
        default: teleportFromShadowDom === true, // should eval to true to teleport elements out of shadow DOM
      },
    })

    const vueCustomElement = defineCustomElement({
      ...customElementComponent,
      props: customElementProps,
      // Inject app styles
      styles: teleportFromShadowDom === true ? [] : [appStyles],
      // Provide user options
      provide: {
        'kauth-api-base-url': options?.apiBaseUrl,
        'user-entity': options?.userEntity || 'user',
        'developer-config': options?.developerConfig,
        'custom-endpoint-error-handler': options?.customErrorHandler,
        'shadow-dom': options?.shadowDom || false,
        'shadow-dom-css': options?.shadowDomCss,
      },
    })

    customElements.define(customElementName, vueCustomElement)
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err?.message)
  }
}
