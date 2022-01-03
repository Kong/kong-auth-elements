import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  AuthenticationApi,
  Configuration,
  EmailVerificationApi,
  IdentityProviderAPIApi,
  InvitesApi,
  LogoutApi,
  PasswordsApi,
  UserAPIApi,
  RegistrationApi,
} from './source'

export default class KongAuthApi {
  authentication: AuthenticationApi
  client: AxiosInstance
  emailVerification: EmailVerificationApi
  idp: IdentityProviderAPIApi
  invites: InvitesApi
  logout: LogoutApi
  passwords: PasswordsApi
  registration: RegistrationApi
  users: UserAPIApi

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
      // This base path MUST start with a leading slash in order to properly
      // resolve within container applications, especially when called from nested routes (e.g. /organizations/users)
      basePath: '/kauth',
    })

    this.authentication = new AuthenticationApi(baseConfig, baseConfig.basePath, this.client)
    this.emailVerification = new EmailVerificationApi(baseConfig, baseConfig.basePath, this.client)
    this.idp = new IdentityProviderAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.invites = new InvitesApi(baseConfig, baseConfig.basePath, this.client)
    this.logout = new LogoutApi(baseConfig, baseConfig.basePath, this.client)
    this.passwords = new PasswordsApi(baseConfig, baseConfig.basePath, this.client)
    this.registration = new RegistrationApi(baseConfig, baseConfig.basePath, this.client)
    this.users = new UserAPIApi(baseConfig, baseConfig.basePath, this.client)
  }
}
