import { Ref } from 'vue';
export declare const resetPasswordEmits: {
    'reset-password-success': (payload: {
        email: string;
    }) => boolean;
};
declare const _default: import("vue").DefineComponent<{}, {
    email: Ref<string>;
    passwordToken: Ref<string>;
    password: Ref<string>;
    confirmPassword: Ref<string>;
    currentState: Ref<import("xstate").State<unknown, import("xstate").EventObject, any, {
        value: any;
        context: unknown;
    }, import("xstate").TypegenDisabled>>;
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
    instructionText: Ref<string>;
    showPasswordStrengthMeter: Ref<boolean>;
    passwordIsInvalid: import("vue").ComputedRef<boolean>;
    submitForm: () => Promise<void>;
    error: any;
    passwordError: Ref<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'reset-password-success': (payload: {
        email: string;
    }) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>> & {
    "onReset-password-success"?: ((payload: {
        email: string;
    }) => any) | undefined;
}, {}>;
export default _default;
