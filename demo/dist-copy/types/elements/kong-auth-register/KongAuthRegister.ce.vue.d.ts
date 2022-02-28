declare const _default: import("vue").DefineComponent<{
    accessCodeRequired: BooleanConstructor;
    instructionText: StringConstructor;
    showPasswordStrengthMeter: BooleanConstructor;
    registerRequestEndpoint: StringConstructor;
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'register-success': (payload: {
        email: string;
        fromInvite: boolean;
    }) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    accessCodeRequired: BooleanConstructor;
    instructionText: StringConstructor;
    showPasswordStrengthMeter: BooleanConstructor;
    registerRequestEndpoint: StringConstructor;
}>> & {
    "onRegister-success"?: ((payload: {
        email: string;
        fromInvite: boolean;
    }) => any) | undefined;
}, {
    accessCodeRequired: boolean;
    showPasswordStrengthMeter: boolean;
}>;
export default _default;
