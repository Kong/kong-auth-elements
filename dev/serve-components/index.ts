import { createApp } from 'vue'
import ComponentsApp from './ComponentsApp.vue'
import KongAuthElements from '../../src/index'
import { KongAuthElementsOptions } from '../../src/utils'

const app = createApp(ComponentsApp)

// Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
const kauthApiBaseUrl = process.env.VUE_APP_KAUTH_API_BASE_URL || '/kauth'

const pluginOptions: KongAuthElementsOptions = {
  apiBaseUrl: kauthApiBaseUrl,
}

app.use(KongAuthElements, pluginOptions)

app.mount('#app')
