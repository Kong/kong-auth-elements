import { ComputedRef } from 'vue';
interface InjectStylesComposable {
    injectedStyles: ComputedRef<string>;
}
export default function useInjectStyles(): InjectStylesComposable;
export {};
