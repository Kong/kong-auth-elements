import { createApp } from 'vue'
import ElementsApp from './ElementsApp.vue'

// Import and register Custom Elements
import { registerKongAuthForgotPassword, registerKongAuthLogin, registerKongAuthRegister, registerKongAuthResetPassword } from '@/elements'

registerKongAuthLogin()
registerKongAuthForgotPassword()
registerKongAuthResetPassword()
registerKongAuthRegister()

const app = createApp(ElementsApp)

app.mount('#app')
