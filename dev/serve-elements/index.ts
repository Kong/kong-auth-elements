import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'
import { registerKongAuthCustomElements } from '../../src/index'
import { KongAuthElementsOptions, UserEntity } from '../../src/utils'

const app = createApp(ElementsApp)

const options: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: UserEntity.USER,
  shadowDom: true,
}

registerKongAuthCustomElements(options)

app.mount('#app')
