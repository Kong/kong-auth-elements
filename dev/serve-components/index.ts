import { createApp } from 'vue'
import ComponentsApp from './ComponentsApp.vue'
import { KongAuthElementsPlugin } from '../../src/index'
import type { KongAuthElementsOptions } from '../../src/utils'

const app = createApp(ComponentsApp)

const pluginOptions: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'user',
  shadowDom: false,
  // injectCss: ['input { color: red !important }'],
  developerConfig: {
    portalId: '83f1733c-862c-43e5-a005-acfb0addfcfb',
  },
  lang: 'en',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // customErrorHandler: ({ error, request, element }): string => {
  //   console.log('error', error)

  //   if (request === 'reset-password-request') {
  //     return 'Custom reset error message.'
  //   } else if (request === 'register-request') {
  //     return 'Custom registration error message.'
  //   }

  //   return ''
  // },
}

app.use(KongAuthElementsPlugin, pluginOptions)

app.mount('#app')