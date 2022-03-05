import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'
import registerKongAuthNativeElements from '../../src/index'
import type { KongAuthElementsOptions } from '../../src/utils'

const app = createApp(ElementsApp)

const options: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'developer',
  customErrorHandler: ({ error, request, element }): string => {
    console.log('error', error)

    if (request === 'reset-password-request') {
      return 'Custom reset error message.'
    } else if (request === 'register-request') {
      return 'Custom registration error message.'
    }
  },
}

registerKongAuthNativeElements(options)

app.mount('#app')
