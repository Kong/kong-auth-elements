import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import dns from 'dns'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// You can set dns.setDefaultResultOrder('verbatim') to disable the reordering behavior. Vite will then print the address as localhost
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    build: {
      // If INCLUDE_VUE=no, do not empty the dist folder on build
      emptyOutDir: process.env.INCLUDE_VUE !== 'no',
      lib: {
        name: 'kong-auth-elements',
        // If INCLUDE_VUE=no, only output UMD
        formats: process.env.INCLUDE_VUE === 'no' ? ['umd'] : ['es', 'umd'],
        entry: path.resolve(__dirname, 'src/index.ts'),
        // If INCLUDE_VUE=no, add `no-vue.` in the filename
        fileName: (format) => `kong-auth-elements.${process.env.INCLUDE_VUE === 'no' ? 'no-vue.' : ''}${format}.js`,
      },
      cssCodeSplit: false,
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled into your library
        // Only enable to utilize as a Vue 3 Plugin
        // If INCLUDE_VUE=no, externalize Vue (for Kong/ui-shared-components)
        external: process.env.INCLUDE_VUE === 'no' ? ['vue'] : undefined,
        output: {
          exports: 'named',
          // Provide global variables to use in the UMD build for externalized deps
          // Enable to utilize consuming app's vue instance
          // If INCLUDE_VUE=no, provide global Vue
          globals: process.env.INCLUDE_VUE === 'no' ? { vue: 'Vue' } : undefined,
        },
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
    resolve: {
      alias: {
        // Alias to the /src directory
        '@/': fileURLToPath(new URL('./src/', import.meta.url)),
      },
    },
    // Change the root when using yarn serve:*
    root: !process.env.SERVE_MODE ? process.cwd() : process.env.SERVE_MODE === 'components' ? './dev/serve-components' : './dev/serve-elements',
    server: {
      port: 4080,
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
      },
    },
  })
}
