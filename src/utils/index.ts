export { default as registerCustomElement } from '@/utils/registerCustomElement'
export { default as kebabize } from '@/utils/kebabize'
export { default as helpText } from '@/utils/helpText'
export { default as win } from '@/utils/window'

export enum UserEntity {
  USERS = 'users',
  DEVELOPERS = 'developers',
}

export interface KongAuthElementsOptions {
  apiBaseUrl?: string
  userEntity?: UserEntity
  shadowDom?: boolean
}
