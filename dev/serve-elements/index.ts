import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'
import registerKongAuthNativeElements from '../../src/index'
import type { KongAuthElementsOptions, CustomEndpointElements } from '../../src/utils'

const app = createApp(ElementsApp)

const options: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'developer',
  customErrorHandler: (element: CustomEndpointElements, error: any) => {
    console.log('error', error)

    if (element === 'kong-auth-forgot-password') {
      return 'Your password is bad.'
    } else if (element === 'kong-auth-register') {
      return 'Custom error for custom registration endpoint.'
    }
  },
}

registerKongAuthNativeElements(options)

app.mount('#app')
