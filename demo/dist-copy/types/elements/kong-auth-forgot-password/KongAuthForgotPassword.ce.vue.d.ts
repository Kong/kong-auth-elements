declare const _default: import("vue").DefineComponent<{
    showLoginLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    loginLinkText: StringConstructor;
    instructionText: StringConstructor;
    successText: StringConstructor;
    resetPasswordRequestEndpoint: StringConstructor;
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'forgot-password-success': (payload: {
        email: string;
    }) => boolean;
    'click-login-link': null;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    showLoginLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    loginLinkText: StringConstructor;
    instructionText: StringConstructor;
    successText: StringConstructor;
    resetPasswordRequestEndpoint: StringConstructor;
}>> & {
    "onForgot-password-success"?: ((payload: {
        email: string;
    }) => any) | undefined;
    "onClick-login-link"?: ((...args: any[]) => any) | undefined;
}, {
    showLoginLink: boolean;
}>;
export default _default;
