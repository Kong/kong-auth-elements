import { Ref } from 'vue';
export declare const forgotPasswordEmits: {
    'forgot-password-success': (payload: {
        email: string;
    }) => boolean;
    'click-login-link': null;
};
declare const _default: import("vue").DefineComponent<{}, {
    email: Ref<string>;
    currentState: Ref<import("xstate").State<unknown, import("xstate").EventObject, any, {
        value: any;
        context: unknown;
    }, import("xstate").TypegenDisabled>>;
    showLoginLink: Ref<boolean>;
    loginLinkText: Ref<string>;
    instructionText: Ref<string>;
    successText: Ref<string>;
    btnText: import("vue").ComputedRef<string>;
    btnDisabled: import("vue").ComputedRef<boolean>;
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
    submitForm: () => Promise<void>;
    error: any;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'forgot-password-success': (payload: {
        email: string;
    }) => boolean;
    'click-login-link': null;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>> & {
    "onForgot-password-success"?: ((payload: {
        email: string;
    }) => any) | undefined;
    "onClick-login-link"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _default;
