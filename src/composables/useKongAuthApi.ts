import KongAuthApi from '@/services/KongAuthApi'
import useConfigOptions from '@/composables/useConfigOptions'

export interface ApiComposable {
  api: KongAuthApi
}

export default function useKongAuthApi(): ApiComposable {
  const { apiBaseUrl } = useConfigOptions()

  // Create new API instance
  const api = new KongAuthApi(apiBaseUrl)

  return {
    api,
  }
}
