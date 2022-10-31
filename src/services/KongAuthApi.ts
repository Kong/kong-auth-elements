import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  AuthenticationApi,
  Configuration,
  EmailVerificationApi,
  IdentityProviderAPIApi,
  InviteAPIApi,
  InvitesApi,
  MeAPIApi,
  OrganizationAPIApi,
  PasswordsApi,
  RegistrationApi,
  TeamAPIApi,
  UserAPIApi,
} from '@kong/kauth-client-typescript-axios'

export default class KongAuthApi {
  baseUrl: string
  client: AxiosInstance
  // APIs
  authentication: AuthenticationApi
  emailVerification: EmailVerificationApi
  idp: IdentityProviderAPIApi
  invites: InviteAPIApi
  inviteAccept: InvitesApi
  me: MeAPIApi
  organization: OrganizationAPIApi
  passwords: PasswordsApi
  registration: RegistrationApi
  teams: TeamAPIApi
  users: UserAPIApi

  constructor(baseUrl?: string, authErrorCallback?: (error: AxiosError) => void) {
    // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
    this.baseUrl = baseUrl?.includes('/kauth') ? baseUrl.replace('/kauth', '') : (baseUrl || '')

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
      basePath: this.baseUrl,
    })

    // v1 endpoints require basePath + '/kauth' (and ensure it does not get included twice)
    const v1Path = '/kauth'
    this.authentication = new AuthenticationApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.emailVerification = new EmailVerificationApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.idp = new IdentityProviderAPIApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.invites = new InviteAPIApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.inviteAccept = new InvitesApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.me = new MeAPIApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.organization = new OrganizationAPIApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.passwords = new PasswordsApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.registration = new RegistrationApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.teams = new TeamAPIApi(baseConfig, baseConfig.basePath + v1Path, this.client)
    this.users = new UserAPIApi(baseConfig, baseConfig.basePath + v1Path, this.client)
  }
}
