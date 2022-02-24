import { createApp } from 'vue'
import ComponentsApp from './ComponentsApp.vue'
import KongAuthElements from '../../src/index'
import { KongAuthElementsOptions, UserEntity } from '../../src/utils'

const app = createApp(ComponentsApp)

const pluginOptions: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: UserEntity.USER,
}

app.use(KongAuthElements, pluginOptions)

app.mount('#app')
