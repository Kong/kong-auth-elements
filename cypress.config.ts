import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        server: {
          host: '127.0.0.1', // This can be removed once Cypress component testing updates for Vite v3
        },
      },
    },
    viewportHeight: 800,
    viewportWidth: 600,
    specPattern: 'src/**/*.spec.ts',
    supportFile: 'cypress/support/index.ts',
  },
  includeShadowDom: true,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  retries: {
    runMode: 1,
  },
  trashAssetsBeforeRuns: false,
})
