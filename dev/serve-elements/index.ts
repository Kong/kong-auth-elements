import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'
import registerKongAuthNativeElements from '../../src/index'
import type { KongAuthElementsOptions } from '../../src/utils'

const app = createApp(ElementsApp)

const options: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'developer',
  shadowDom: false,
  lang: 'en',
  developerConfig: {
    portalId: 'dfc77af7-ba97-4c52-889e-b2ca75b51ed3',
  },
  customErrorHandler: ({ error, request, element }): string => {
    console.log('error', error)

    if (request === 'reset-password-request') {
      return 'Custom reset error message.'
    } else if (request === 'register-request') {
      return 'Custom registration error message.'
    } else if (element === 'kong-auth-login') {
      // Returning null or false (or an empty string) will cause the default messaging to be used
      return null
    }
  },
}

registerKongAuthNativeElements(options)

app.mount('#app')
