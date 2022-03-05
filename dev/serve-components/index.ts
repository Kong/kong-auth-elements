import { createApp } from 'vue'
import ComponentsApp from './ComponentsApp.vue'
import { KongAuthElementsPlugin } from '../../src/index'
import type { KongAuthElementsOptions, CustomEndpointElements } from '../../src/utils'

const app = createApp(ComponentsApp)

const pluginOptions: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'developer',
  // customErrorHandler: (element: CustomEndpointElements, error: any) => {
  //   console.log('error', error)

  //   if (element === 'kong-auth-forgot-password') {
  //     return 'Your password is bad.'
  //   } else if (element === 'kong-auth-register') {
  //     return 'Your registration request could not be processed.'
  //   }
  // },
}

app.use(KongAuthElementsPlugin, pluginOptions)

app.mount('#app')
