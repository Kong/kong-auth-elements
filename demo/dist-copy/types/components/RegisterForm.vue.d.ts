import { Ref } from 'vue';
export declare const registerEmits: {
    'register-success': (payload: {
        email: string;
        fromInvite: boolean;
    }) => boolean;
};
declare const _default: import("vue").DefineComponent<{}, {
    email: Ref<string>;
    fullName: Ref<string>;
    emailToken: Ref<string>;
    organization: Ref<string>;
    prepopulated: Ref<boolean>;
    accessCode: Ref<string>;
    password: Ref<string>;
    checked_agreement: Ref<boolean>;
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
    submitForm: () => Promise<void>;
    error: any;
    passwordError: Ref<boolean>;
    fieldsHaveError: Ref<boolean>;
    accessCodeRequired: Ref<boolean>;
    instructionText: Ref<string>;
    showPasswordStrengthMeter: Ref<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'register-success': (payload: {
        email: string;
        fromInvite: boolean;
    }) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>> & {
    "onRegister-success"?: ((payload: {
        email: string;
        fromInvite: boolean;
    }) => any) | undefined;
}, {}>;
export default _default;
