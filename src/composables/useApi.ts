import { inject } from 'vue'
import KongAuthApi from '@/services/KongAuthApi'

export interface ApiComposable {
  api: KongAuthApi
  useDeveloperEndpoints: boolean
}

export default function useApi(): ApiComposable {
  // Inject option values to components
  const apiBaseUrl = inject('kauth-api-base-url', '')
  const useDeveloperEndpoints = inject('developers', false)

  // Create new API instance
  const api = new KongAuthApi(apiBaseUrl)

  return {
    api,
    useDeveloperEndpoints,
  }
}
