// Do not use '@' alias in paths here so that imports within a consuming project resolve properly.
import { AxiosError } from 'axios'
export { default as registerCustomElement } from './registerCustomElement'
export { default as kebabize } from './kebabize'
export { default as win } from './window'

// List of user entities
export type UserEntities = 'user' | 'developer'

// List of custom elements that accept a custom error handler
export type CustomEndpointElement = 'kong-auth-login' | 'kong-auth-forgot-password' | 'kong-auth-register' | 'kong-auth-reset-password' | 'kong-auth-accept-invitation'

// List of requests that support custom endpoints
export type CustomEndpointRequest = 'authenticate-request' | 'verify-email-request' | 'reset-password-request' | 'register-request' | 'set-new-password-request' | 'accept-invitation-request'

export interface CustomEndpointErrorEvent {
  error: AxiosError
  request: CustomEndpointRequest
  element: CustomEndpointElement
}

// Developer config options
export interface DeveloperConfig {
  portalId: string
}

// List of supported languages, add more like || 'es'
export type SupportedLanguages = 'en'

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: UserEntities
  developerConfig?: DeveloperConfig
  customErrorHandler?: (event: CustomEndpointErrorEvent) => string
  shadowDom?: boolean
  shadowDomCss?: string[]
  lang?: SupportedLanguages
}
