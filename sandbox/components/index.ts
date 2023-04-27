import { createApp } from 'vue'
import ComponentsApp from './ComponentsApp.vue'
import { KongAuthElementsPlugin } from '../../src/index'
import type { KongAuthElementsOptions } from '../../src/utils'
import router from '../shared/router'

const app = createApp(ComponentsApp)

const pluginOptions: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'user',
  shadowDom: false,
  developerConfig: {
    portalId: '83f1733c-862c-43e5-a005-acfb0addfcfb',
  },
  lang: 'en',
}

app.use(KongAuthElementsPlugin, pluginOptions)

app.use(router)

app.mount('#app')
