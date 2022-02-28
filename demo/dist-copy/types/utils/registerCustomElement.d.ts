import { VueElementConstructor } from 'vue';
import type { KongAuthElementsOptions } from './index';
/**
 * Register a given Vue component as a Custom Element in the DOM.
 * @param {string} tagName - The name of the custom element to be used as the HTML tag.
 * @param {VueComponent} customElementComponent - The Vue component.
 */
export default function (tagName: string, customElementComponent: VueElementConstructor<any>, options?: KongAuthElementsOptions): void;
