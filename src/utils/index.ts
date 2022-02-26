// Do not use '@' alias in paths here so that imports within a consuming project resolve properly.
export { default as registerCustomElement } from './registerCustomElement'
export { default as kebabize } from './kebabize'
export { default as helpText } from './helpText'
export { default as win } from './window'

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: 'user' | 'developer'
  shadowDom?: boolean
}
