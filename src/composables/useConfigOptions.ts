import { inject } from 'vue'
import { KongAuthElementsOptions } from '@/utils'

// Wrap the inject functions in an object w/ functions so they can be
// stubbed in the component tests.
export const getConfigOptions = {
  apiBaseUrl: (): string => inject('kauth-api-base-url', ''),
  userEntity: (): 'user' | 'developer' => inject('user-entity', 'user'),
  shadowDom: (): boolean => inject('shadow-dom', false),
  shadowDomCss: (): string[] => inject('shadow-dom-css', []),
}

export default function useConfigOptions(): KongAuthElementsOptions {
  const apiBaseUrl = getConfigOptions.apiBaseUrl()
  const userEntity = getConfigOptions.userEntity()
  const shadowDom = getConfigOptions.shadowDom()
  const shadowDomCss = getConfigOptions.shadowDomCss()

  return {
    apiBaseUrl,
    userEntity,
    shadowDom,
    shadowDomCss,
  }
}
