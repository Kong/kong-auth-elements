declare const _default: import("vue").DefineComponent<{
    instructionText: StringConstructor;
    showPasswordStrengthMeter: BooleanConstructor;
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'reset-password-success': (payload: {
        email: string;
    }) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    instructionText: StringConstructor;
    showPasswordStrengthMeter: BooleanConstructor;
}>> & {
    "onReset-password-success"?: ((payload: {
        email: string;
    }) => any) | undefined;
}, {
    showPasswordStrengthMeter: boolean;
}>;
export default _default;
