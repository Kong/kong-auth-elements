import axios, { AxiosInstance, AxiosError } from 'axios'
// KAuth v1 APIs
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
// KAuth v2 APIs: All KAuth v2 APIs should be aliased as `V2{ApiName}`
import {
  Configuration as V2Configuration,
  MeApi as V2MeApi,
} from '@kong/kauth-client-v2-axios'

export default class KongAuthApi {
  baseUrl: string
  client: AxiosInstance
  // KAuth v1 APIs
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

  // KAuth v2 APIs
  // All V2 APIs should be exposed within the `v2: {}` object
  v2: {
    me: V2MeApi
  }

  constructor(baseUrl?: string, authErrorCallback?: (error: AxiosError) => void) {
    // Unless using an absolute URL, this base path MUST start with a leading slash (if setting the default) in order to properly resolve within container applications, especially when called from nested routes(e.g. /organizations/users)
    this.baseUrl = baseUrl || ''

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

    // KAuth v1 API baseConfig
    const baseConfig = new Configuration({
      basePath: this.baseUrl,
    })

    // KAuth v2 API baseConfig
    const baseConfigV2 = new V2Configuration({
      basePath: '/v2',
    })

    // KAuth v1 APIs
    this.authentication = new AuthenticationApi(baseConfig, baseConfig.basePath, this.client)
    this.emailVerification = new EmailVerificationApi(baseConfig, baseConfig.basePath, this.client)
    this.idp = new IdentityProviderAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.invites = new InviteAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.inviteAccept = new InvitesApi(baseConfig, baseConfig.basePath, this.client)
    this.me = new MeAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.organization = new OrganizationAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.passwords = new PasswordsApi(baseConfig, baseConfig.basePath, this.client)
    this.registration = new RegistrationApi(baseConfig, baseConfig.basePath, this.client)
    this.teams = new TeamAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.users = new UserAPIApi(baseConfig, baseConfig.basePath, this.client)

    // KAuth v2 APIs
    this.v2 = {
      me: new V2MeApi(baseConfigV2, baseConfigV2.basePath, this.client),
    }
  }
}
