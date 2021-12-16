import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  AuthenticationApi,
  Configuration,
  EmailVerificationApi,
  IdentityProviderAPIApi,
  InvitesApi,
  PasswordsApi,
  RegistrationApi,
} from './kauth-api-client'

export default class KongAuthApi {
  auth: {
    authentication: AuthenticationApi
    passwords: PasswordsApi
  }

  idp: IdentityProviderAPIApi

  register: {
    registration: RegistrationApi
    emailVerification: EmailVerificationApi
    invites: InvitesApi
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
      passwords: new PasswordsApi(baseConfig, baseConfig.basePath, this.client),
    }

    this.idp = new IdentityProviderAPIApi(baseConfig, baseConfig.basePath, this.client)

    this.register = {
      registration: new RegistrationApi(baseConfig, baseConfig.basePath, this.client),
      emailVerification: new EmailVerificationApi(baseConfig, baseConfig.basePath, this.client),
      invites: new InvitesApi(baseConfig, baseConfig.basePath, this.client),
    }
  }
}
