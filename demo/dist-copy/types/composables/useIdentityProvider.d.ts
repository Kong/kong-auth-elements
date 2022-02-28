import { Ref } from 'vue';
interface IdentityProviderComposable {
    isIdpLogin: Ref<boolean>;
    idpIsLoading: Ref<boolean>;
    shouldTriggerIdpLogin(): boolean;
    shouldTriggerIdpAuthentication(): boolean;
    redirectToIdp(returnTo: string): void;
    authenticateWithIdp(): void;
}
/**
 * Composable function to utilize the IDP-related kauth flow.
 * @export IdentityProviderComposable
 * @param {ref<boolean>} idpIsEnabled - If true, automatically handle IDP in the onMounted lifecycle hook.
 * @param {ref<string>} idpLoginRedirectTo - Pass the returnTo URL. Must include 'konghq.com' or 'localhost' (localhost does not work currently).
 * @return {*}  {IdentityProviderComposable}
 */
export default function useIdentityProvider(idpIsEnabled: Ref<boolean>, idpLoginRedirectTo: Ref<string>): IdentityProviderComposable;
export {};
