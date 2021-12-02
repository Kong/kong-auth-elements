/*
This module augmentation is due to a bug, patched in https://github.com/segmentio/analytics.js-core/pull/181.

If the above PR is merged and released, then please:
  1. update the package.json with the new `@segment/analytics.js-core` version
  1. delete the `SegmentAnalytics` namespace (the `MixpanelIntegration` namespace is separate)
*/

import SegmentAnalytics from '@segment/analytics.js-core';

declare module '@segment/analytics.js-core' {
  namespace SegmentAnalytics {
    type IntegrationSettings<T> = T;

    type PageProperties = Record<string, unknown>;
    type PageOptions = Record<string, unknown>;
    type PageCallback = () => void;

    interface AnalyticsJS {
      /**
       * Trigger a pageview.
       */
      page(
        category: string,
        name: string,
        properties: PageProperties,
        options: PageOptions,
        callback: PageCallback,
      ): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(
        category: string,
        name: string,
        properties: PageProperties,
        callback: PageCallback,
      ): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(category: string, name: string, callback: PageCallback): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(
        name: string,
        properties: PageProperties,
        options: PageOptions,
        callback: PageCallback,
      ): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(
        name: string,
        properties: PageProperties,
        callback: PageCallback,
      ): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(name: string, callback: PageCallback): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(name: string): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(
        properties: PageProperties,
        options: PageOptions,
        callback: PageCallback,
      ): AnalyticsJS;

      /**
       * Trigger a pageview.
       */
      page(properties: PageProperties, callback: PageCallback): AnalyticsJS;
    }
  }
}
