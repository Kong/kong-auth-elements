import { inject } from 'vue'
import KongAuthApi from '@/services/KongAuthApi'

export interface ApiComposable {
  api: KongAuthApi
  userEntity: 'user' | 'developer'
}

export default function useApi(): ApiComposable {
  // Inject option values to components
  const apiBaseUrl = inject('kauth-api-base-url', '')
  const userEntity = inject('user-entity', 'user')

  // Create new API instance
  const api = new KongAuthApi(apiBaseUrl)

  return {
    api,
    userEntity,
  }
}
