import { Ref } from 'vue';
export declare const loginEmits: {
    'login-success': null;
    'verify-email-success': (payload: {
        email: string;
    }) => boolean;
    'click-forgot-password-link': null;
    'click-register-link': null;
    'idp-is-loading': (payload: {
        isLoading: boolean;
    }) => boolean;
};
declare const _default: import("vue").DefineComponent<{}, {
    email: Ref<string>;
    password: Ref<string>;
    instructionText: Ref<string>;
    showForgotPasswordLink: Ref<boolean>;
    forgotPasswordLinkText: Ref<string>;
    showRegisterLink: Ref<boolean>;
    helpText: {
        login: {
            forgotPasswordLinkText: string;
            registerLinkText: string;
            registerLinkHelpText: string;
            unauthenticated: string;
            accountLocked: string;
            passwordResetSuccess: string;
            confirmedEmailSuccess: string;
            registerSuccess: string;
            loginWithCredentials: string;
            loginText: string;
            loginTextSSO: string;
            submittingText: string;
        };
        forgotPassword: {
            loginLinkText: string;
            missingEmail: string;
            success: string;
            submitText: string;
            submittingText: string;
        };
        register: {
            submitText: string;
            submittingText: string;
        };
        resetPassword: {
            passwordMismatch: string;
            submitText: string;
            submittingText: string;
        };
        general: {
            missingInfo: string;
            invalidAccessCode: string;
            serviceUnavailable: string;
        };
    };
    registerLinkHelpText: Ref<string>;
    registerLinkText: Ref<string>;
    btnText: import("vue").ComputedRef<string>;
    btnDisabled: import("vue").ComputedRef<boolean>;
    currentState: Ref<import("xstate").State<unknown, import("xstate").EventObject, any, {
        value: any;
        context: unknown;
    }, import("xstate").TypegenDisabled>>;
    submitForm: () => Promise<void>;
    loginWithCredentials: () => void;
    error: any;
    fieldsHaveError: Ref<boolean>;
    isIdpLogin: Ref<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'login-success': null;
    'verify-email-success': (payload: {
        email: string;
    }) => boolean;
    'click-forgot-password-link': null;
    'click-register-link': null;
    'idp-is-loading': (payload: {
        isLoading: boolean;
    }) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>> & {
    "onLogin-success"?: ((...args: any[]) => any) | undefined;
    "onVerify-email-success"?: ((payload: {
        email: string;
    }) => any) | undefined;
    "onClick-forgot-password-link"?: ((...args: any[]) => any) | undefined;
    "onClick-register-link"?: ((...args: any[]) => any) | undefined;
    "onIdp-is-loading"?: ((payload: {
        isLoading: boolean;
    }) => any) | undefined;
}, {}>;
export default _default;
