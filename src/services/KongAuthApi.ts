import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  AuthenticationApi,
  EmailVerificationApi,
  Configuration,
  InvitesApi,
  PasswordsApi,
  RegistrationApi,
} from './kauth-api-client'

export default class KongAuthApi {
  auth: {
    authentication: AuthenticationApi
    emailVerification: EmailVerificationApi
    invites: InvitesApi
    passwords: PasswordsApi
    registration: RegistrationApi
  }

  client: AxiosInstance

  constructor(authErrorCallback?: (error: AxiosError) => void) {
    this.client = axios.create({ withCredentials: true })

    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 401 && authErrorCallback) {
          authErrorCallback(error)
        }
        return Promise.reject(error)
      },
    )

    const baseConfig = new Configuration({
      basePath: 'kauth/api',
    })

    this.auth = {
      authentication: new AuthenticationApi(baseConfig, baseConfig.basePath, this.client),
      emailVerification: new EmailVerificationApi(baseConfig, baseConfig.basePath, this.client),
      invites: new InvitesApi(baseConfig, baseConfig.basePath, this.client),
      passwords: new PasswordsApi(baseConfig, baseConfig.basePath, this.client),
      registration: new RegistrationApi(baseConfig, baseConfig.basePath, this.client),
    }
  }
}
