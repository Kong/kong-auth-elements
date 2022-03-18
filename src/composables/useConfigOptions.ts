import { inject } from 'vue'
import type { KongAuthElementsOptions, UserEntities, PortalConfig, CustomEndpointErrorEvent } from '@/utils'

// Wrap the inject functions in an object w/ functions so they can be
// stubbed in the component tests.
export const getConfigOptions = {
  apiBaseUrl: (): string => inject('kauth-api-base-url', ''),
  userEntity: (): UserEntities => inject('user-entity', 'user'),
  customErrorHandler: (): (event: CustomEndpointErrorEvent) => string => inject('custom-endpoint-error-handler', () => ''),
  shadowDom: (): boolean => inject('shadow-dom', false),
  shadowDomCss: (): string[] => inject('shadow-dom-css', []),
  portalConfig: (): PortalConfig => inject('portal-config', { id: '' }),
}

export default function useConfigOptions(): KongAuthElementsOptions {
  const apiBaseUrl = getConfigOptions.apiBaseUrl()
  const userEntity = getConfigOptions.userEntity()
  const customErrorHandler = getConfigOptions.customErrorHandler()
  const shadowDom = getConfigOptions.shadowDom()
  const shadowDomCss = getConfigOptions.shadowDomCss()
  const portalConfig = getConfigOptions.portalConfig()

  return {
    apiBaseUrl,
    userEntity,
    customErrorHandler,
    shadowDom,
    shadowDomCss,
    portalConfig,
  }
}
