import { App } from 'vue'
// Do not use '@' alias in utils paths here so that imports within a consuming project resolve properly.
import { registerCustomElement } from './utils'
import type {
  CustomEndpointElement,
  CustomEndpointErrorEvent,
  CustomEndpointRequest,
  KongAuthElementsOptions,
  DeveloperConfig,
  UserEntities,
} from './utils'
// Import all elements
import * as elements from './elements'

// Export a Vue plugin install function
export const KongAuthElementsPlugin = {
  install: (app: App, options?: KongAuthElementsOptions): any => {
    // Provide option values to components
    app.provide('kauth-api-base-url', options?.apiBaseUrl)
    app.provide('user-entity', options?.userEntity || 'user')
    app.provide('developer-config', options?.developerConfig)
    app.provide('custom-endpoint-error-handler', options?.customErrorHandler)
    // Since we are registering as a native Vue plugin, force options.shadowDom to false
    app.provide('shadow-dom', false)
    app.provide('inject-css', options?.injectCss)
    app.provide('lang', options?.lang)

    // Register all components
    for (const key in elements) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      app.component(key, elements[key])
    }
  },
}

// Exports a function that registers all custom elements as native web components
export default function registerKongAuthNativeElements(options?: KongAuthElementsOptions): void {
  const userOptions = Object.assign({}, options)

  // Since we are registering custom elements as native web components, force options.shadowDom to true
  userOptions.shadowDom = true

  registerCustomElement('kong-auth-accept-invitation', elements.KongAuthAcceptInvitation, userOptions)
  registerCustomElement('kong-auth-forgot-password', elements.KongAuthForgotPassword, userOptions)
  registerCustomElement('kong-auth-login', elements.KongAuthLogin, userOptions)
  registerCustomElement('kong-auth-register', elements.KongAuthRegister, userOptions)
  registerCustomElement('kong-auth-reset-password', elements.KongAuthResetPassword, userOptions)
  registerCustomElement('kong-auth-change-password', elements.KongAuthChangePassword, userOptions)
}

export {
  CustomEndpointElement,
  CustomEndpointErrorEvent,
  CustomEndpointRequest,
  KongAuthElementsOptions,
  DeveloperConfig,
  UserEntities,
}

// Auto-register the function to the window object
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.registerKongAuthNativeElements = registerKongAuthNativeElements
}
