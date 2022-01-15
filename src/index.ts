// Elements
import { registerKongAuthLogin } from '@/elements/kong-auth-login'
import { registerKongAuthForgotPassword } from '@/elements/kong-auth-forgot-password'
import { registerKongAuthResetPassword } from '@/elements/kong-auth-reset-password'
import { registerKongAuthRegister } from '@/elements/kong-auth-register'
// Import API - Do not use '@' alias in path here so that imports within a consuming project resolve properly.
import KongAuthApi from './services/kauth-api-client/v1/KongAuthApi'

registerKongAuthLogin()
registerKongAuthForgotPassword()
registerKongAuthResetPassword()
registerKongAuthRegister()

// Export API Class
export default KongAuthApi

// Export API Interfaces
export * from './services/kauth-api-client/v1/api'
