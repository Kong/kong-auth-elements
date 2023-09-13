import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dns from 'dns'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// You can set dns.setDefaultResultOrder('verbatim') to disable the reordering behavior. Vite will then print the address as localhost
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

// Include the rollup-plugin-visualizer if the BUILD_VISUALIZER env var is set to "true"
const buildVisualizerPlugin = process.env.BUILD_VISUALIZER
  ? visualizer({
    filename: path.resolve(__dirname, 'bundle-analyzer/stats-treemap.html'),
    template: 'treemap', // sunburst|treemap|network
    sourcemap: true,
    gzipSize: true,
  })
  : undefined

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  // Determine the root when using yarn dev:{components|elements}, otherwise use the package root (process.cwd())
  const getRoot = () => {
    if (!process.env.SANDBOX) {
      return process.cwd()
    } else if (process.env.SANDBOX === 'components') {
      return './sandbox/components'
    } else if (process.env.SANDBOX === 'elements') {
      return './sandbox/elements'
    } else if (process.env.SANDBOX === 'web-components') {
      return './sandbox/web-components'
    }
  }

  return defineConfig({
    // Define global constant replacements
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.production': JSON.stringify('production'),
      'process.env.development': JSON.stringify('development'),
    },
    build: {
      sourcemap: !!process.env.BUILD_VISUALIZER,
      // If INCLUDE_VUE=true, do not empty the dist folder on build
      emptyOutDir: process.env.INCLUDE_VUE === 'true',
      // If PREVIEW=true, do not build as a library
      lib: process.env.PREVIEW === 'true'
        ? undefined
        : {
          name: 'KongAuthElements',
          entry: path.resolve(__dirname, 'src/index.ts'),
          // If INCLUDE_VUE=true, add `vue.` in the filename
          fileName: (format: any) => `kong-auth-elements.${process.env.INCLUDE_VUE === 'true' ? 'vue.' : ''}${format}.js`,
        },
      cssCodeSplit: false,
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled into your library
        // Only enable to utilize as a Vue 3 Plugin
        // If INCLUDE_VUE=true, externalize Vue (for Kong/ui-shared-components)
        external: process.env.INCLUDE_VUE === 'true' ? undefined : ['vue', '@kong/kongponents'],
        output: {
          sourcemap: true,
          exports: 'named',
          // Provide global variables to use in the UMD build for externalized deps
          // Enable to utilize consuming app's vue instance
          // If INCLUDE_VUE=true, provide global Vue
          globals: process.env.INCLUDE_VUE === 'true' ? undefined : { vue: 'Vue' },
        },
        plugins: [
          // visualizer must remain last in the list of plugins
          buildVisualizerPlugin,
        ],
      },
    },
    optimizeDeps: {
      include: [
        '@cypress/vue',
        'vue',
      ],
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('kong-auth'),
          },
        },
      }),
    ],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        // Alias to the /src directory
        '@/': fileURLToPath(new URL('./src/', import.meta.url)),
      },
    },
    root: getRoot(),
    server: {
      open: true,
      proxy: {
        '^/api': {
          target: process.env.VITE_AUTH_URL,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
        '^/kauth/api': {
          target: process.env.VITE_AUTH_URL,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
        '^/v2': {
          target: process.env.VITE_AUTH_URL,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
      },
    },
  })
}
