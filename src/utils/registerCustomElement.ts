import { defineCustomElement, mergeProps, DefineComponent } from 'vue'
import { kebabize } from './index'
import type { KongAuthElementsOptions } from './index'
import appStyles from '../assets/styles/app.scss'

/**
 * Register a given Vue component as a Custom Element in the DOM.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 * @param {VueComponent} customElementComponent - The Vue component.
 */
export default function(
  tagName: string,
  customElementComponent: DefineComponent<any>,
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
      throw new Error(`registerCustomElement: Unable to register custom element <${customElementName}> -- the name has already been registered.`)
    }

    // Add a custom prop to teleport the custom element out of the shadow DOM and merge it with the existing props
    const customElementProps = mergeProps({ ...customElementComponent.props }, {
      shouldTeleport: {
        type: Boolean,
        default: true,
      },
    })

    const vueCustomElement = defineCustomElement({
      ...customElementComponent,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      props: customElementProps,
      // Inject app styles
      styles: [appStyles],
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
