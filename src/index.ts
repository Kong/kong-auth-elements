// Elements
import { registerKongAuthLogin } from '@/elements/kong-auth-login'
import { registerKongAuthForgotPassword } from '@/elements/kong-auth-forgot-password'
import { registerKongAuthResetPassword } from '@/elements/kong-auth-reset-password'
import { registerKongAuthRegister } from '@/elements/kong-auth-register'
// API
import KongAuthApi from './services/KongAuthApi'

registerKongAuthLogin()
registerKongAuthForgotPassword()
registerKongAuthResetPassword()
registerKongAuthRegister()

export default KongAuthApi
