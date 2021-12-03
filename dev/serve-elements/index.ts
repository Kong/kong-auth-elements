import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'

// Import and register Custom Elements
import { registerKongAuthLogin } from '@/elements/kong-auth-login'
import { registerKongAuthForgotPassword } from '@/elements/kong-auth-forgot-password'
registerKongAuthLogin()
registerKongAuthForgotPassword()

const app = createApp(ElementsApp)

app.mount('#app')
