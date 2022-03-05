// Do not use '@' alias in paths here so that imports within a consuming project resolve properly.
export { default as registerCustomElement } from './registerCustomElement'
export { default as kebabize } from './kebabize'
export { default as helpText } from './helpText'
export { default as win } from './window'

export type UserEntities = 'user' | 'developer'

// List of custom elements that accept a custom error handler
export type CustomEndpointElements = 'kong-auth-forgot-password' | 'kong-auth-register'

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: UserEntities
  customErrorHandler?: (element: CustomEndpointElements, error: any) => string
  shadowDom?: boolean
  shadowDomCss?: string[]
}
