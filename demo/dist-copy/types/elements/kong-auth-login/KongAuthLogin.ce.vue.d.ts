declare const _default: import("vue").DefineComponent<{
    instructionText: StringConstructor;
    showForgotPasswordLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    forgotPasswordLinkText: StringConstructor;
    showRegisterLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    registerLinkHelpText: StringConstructor;
    registerLinkText: StringConstructor;
    idpLoginEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    idpLoginReturnTo: {
        type: StringConstructor;
    };
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'login-success': null;
    'verify-email-success': (payload: {
        email: string;
    }) => boolean;
    'click-forgot-password-link': null;
    'click-register-link': null;
    'idp-is-loading': (payload: {
        isLoading: boolean;
    }) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    instructionText: StringConstructor;
    showForgotPasswordLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    forgotPasswordLinkText: StringConstructor;
    showRegisterLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    registerLinkHelpText: StringConstructor;
    registerLinkText: StringConstructor;
    idpLoginEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    idpLoginReturnTo: {
        type: StringConstructor;
    };
}>> & {
    "onLogin-success"?: ((...args: any[]) => any) | undefined;
    "onVerify-email-success"?: ((payload: {
        email: string;
    }) => any) | undefined;
    "onClick-forgot-password-link"?: ((...args: any[]) => any) | undefined;
    "onClick-register-link"?: ((...args: any[]) => any) | undefined;
    "onIdp-is-loading"?: ((payload: {
        isLoading: boolean;
    }) => any) | undefined;
}, {
    showForgotPasswordLink: boolean;
    showRegisterLink: boolean;
    idpLoginEnabled: boolean;
}>;
export default _default;
