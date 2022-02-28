import { AxiosInstance, AxiosError } from 'axios';
import { AuthenticationApi, ClientConfigApi, EmailVerificationApi, IdentityProviderAPIApi, InviteAPIApi, InvitesApi, LogoutApi, MeAPIApi, PasswordsApi, RegistrationApi, TeamAPIApi, UserAPIApi } from '@kong/kauth-client-typescript-axios';
export default class KongAuthApi {
    baseUrl: string;
    client: AxiosInstance;
    authentication: AuthenticationApi;
    clientConfig: ClientConfigApi;
    emailVerification: EmailVerificationApi;
    idp: IdentityProviderAPIApi;
    invites: InviteAPIApi;
    inviteAccept: InvitesApi;
    logout: LogoutApi;
    me: MeAPIApi;
    passwords: PasswordsApi;
    registration: RegistrationApi;
    teams: TeamAPIApi;
    users: UserAPIApi;
    constructor(baseUrl?: string, authErrorCallback?: (error: AxiosError) => void);
}
