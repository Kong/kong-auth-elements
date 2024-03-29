import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'
import registerKongAuthNativeElements from '../../src/index'
import type { KongAuthElementsOptions } from '../../src/utils'
import router from '../shared/router'

const app = createApp(ElementsApp)

const options: KongAuthElementsOptions = {
  // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
  apiBaseUrl: '/kauth',
  userEntity: 'user',
  lang: 'en',
  developerConfig: {
    portalId: 'dfc77af7-ba97-4c52-889e-b2ca75b51ed3',
  },
  shadowDom: true, // set to true since we're using elements not vue components (we want the shadow DOM here)
  customErrorHandler: ({ error, request, element }): string => {
    console.log('error', error)

    if (request === 'reset-password-request') {
      return 'Custom reset error message.'
    } else if (request === 'change-password-request') {
      return 'Custom change error message.'
    } else if (request === 'register-request') {
      return 'Custom registration error message.'
    } else if (element === 'kong-auth-login') {
      // Returning null or false (or an empty string) will cause the default messaging to be used
      return ''
    }

    return ''
  },
}

registerKongAuthNativeElements(options)

app.use(router)

app.mount('#app')
