// Do not use '@' alias in paths here so that imports within a consuming project resolve properly.
import { AxiosError } from 'axios'
export { default as registerCustomElement } from './registerCustomElement'
export { default as kebabize } from './kebabize'
export { default as helpText } from './helpText'
export { default as win } from './window'

// List of user entities
export type UserEntities = 'user' | 'developer'

// List of custom elements that accept a custom error handler
export type CustomEndpointElement = 'kong-auth-forgot-password' | 'kong-auth-register'

// List of requests that support custom endpoints
export type CustomEndpointRequest = 'reset-password-request' | 'register-request'

export type CustomEndpointErrorEvent = {
  error: AxiosError
  request: CustomEndpointRequest
  element: CustomEndpointElement
}

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: UserEntities
  customErrorHandler?: (event: CustomEndpointErrorEvent) => string
  shadowDom?: boolean
  shadowDomCss?: string[]
}
