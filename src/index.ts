import { App } from 'vue'
// Do not use '@' alias in paths here so that imports within a consuming project resolve properly.
import { registerCustomElement } from './utils'
import type { KongAuthElementsOptions } from './utils'
import * as elements from './elements'

// Export a Vue plugin install function
const KongAuthElementsPlugin = (app: App, options?: KongAuthElementsOptions): any => {
  // Provide option values to components
  app.provide('kauth-api-base-url', options?.apiBaseUrl)
  app.provide('user-entity', options?.userEntity || 'user')
  app.provide('shadow-dom', options?.shadowDom || false)

  if (options?.shadowDom === true) {
    // Register all custom elements as native web components
    registerKongAuthNativeElements(options)
  } else {
    // Register all components
    for (const key in elements) {
      app.component(key, elements[key])
    }
  }
}

// Exports a function that registers all custom elements as native web components
export default function registerKongAuthNativeElements(options?: KongAuthElementsOptions): void {
  const userOptions = Object.assign({}, options)

  // Since we are registering custom elements as native web components, force options.shadowDom to true
  userOptions.shadowDom = true

  registerCustomElement('kong-auth-forgot-password', elements.KongAuthForgotPassword, userOptions)
  registerCustomElement('kong-auth-login', elements.KongAuthLogin, userOptions)
  registerCustomElement('kong-auth-register', elements.KongAuthRegister, userOptions)
  registerCustomElement('kong-auth-reset-password', elements.KongAuthResetPassword, userOptions)
}

export { KongAuthElementsPlugin, KongAuthElementsOptions }
