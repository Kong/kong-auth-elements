import { inject } from 'vue'
import KongAuthApi from '@/services/KongAuthApi'
import { UserEntity } from '@/utils'

export interface ApiComposable {
  api: KongAuthApi
  userEntity: UserEntity
}

export default function useApi(): ApiComposable {
  // Inject option values to components
  const apiBaseUrl = inject('kauth-api-base-url', '')
  const userEntity = inject('user-entity', UserEntity.USER)

  // Create new API instance
  const api = new KongAuthApi(apiBaseUrl)

  return {
    api,
    userEntity,
  }
}
