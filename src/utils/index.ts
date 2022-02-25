export { default as registerCustomElement } from './registerCustomElement'
export { default as kebabize } from './kebabize'
export { default as helpText } from './helpText'
export { default as win } from './window'

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: 'user' | 'developer'
  shadowDom?: boolean
}
