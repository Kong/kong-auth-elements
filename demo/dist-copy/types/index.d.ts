import { App } from 'vue';
import type { KongAuthElementsOptions } from './utils';
declare const KongAuthElementsPlugin: (app: App, options?: KongAuthElementsOptions | undefined) => any;
export default function registerKongAuthNativeElements(options?: KongAuthElementsOptions): void;
export { KongAuthElementsPlugin, KongAuthElementsOptions };
