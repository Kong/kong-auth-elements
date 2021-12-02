import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'

// Import and register Custom Elements
import { registerKongAuthLoginElement } from '@/elements/kong-auth-login'
registerKongAuthLoginElement()

const app = createApp(ElementsApp)

app.mount('#app')
