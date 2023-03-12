import { defineConfig } from 'cypress'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.production': JSON.stringify('production'),
          'process.env.development': JSON.stringify('development'),
        },
        plugins: [
          vue(),
        ],
        resolve: {
          alias: {
            // Alias to the /src directory
            '@/': fileURLToPath(new URL('./src/', import.meta.url)),
          },
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
