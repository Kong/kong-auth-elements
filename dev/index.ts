import { createApp } from 'vue'
import DevApp from './DevApp.vue'

import { registerKongAuthLoginElement } from '@/elements/kong-auth-login'

registerKongAuthLoginElement()

const devApp = createApp(DevApp)

devApp.mount('#app')
