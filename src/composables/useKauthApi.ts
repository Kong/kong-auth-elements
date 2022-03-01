import { inject } from 'vue'
import KongAuthApi from '@/services/KongAuthApi'

export interface ApiComposable {
  api: KongAuthApi
  userEntity: 'user' | 'developer'
}

// Wrapping in an object so that it can be stubbed in component tests
export const getConfigOptions = {
  apiBaseUrl: (): string => inject('kauth-api-base-url', ''),
  userEntity: (): 'user' | 'developer' => inject('user-entity', 'user'),
}

export default function useKauthApi(): ApiComposable {
  // Inject option values to components
  const apiBaseUrl = getConfigOptions.apiBaseUrl()
  const userEntity = getConfigOptions.userEntity()

  // Create new API instance
  const api = new KongAuthApi(apiBaseUrl)

  return {
    api,
    userEntity,
  }
}
