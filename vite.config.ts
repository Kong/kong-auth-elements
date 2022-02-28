import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    root: !process.env.SERVE_MODE ? process.cwd() : process.env.SERVE_MODE === 'components' ? './dev/serve-components' : './dev/serve-elements',
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'kong-auth-elements',
        fileName: (format) => `kong-auth-elements.${format}.js`,
      },
      rollupOptions: {
        output: {
          exports: 'named',
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
            compatConfig: {
              MODE: 3,
            },
          },
        },
      }),
    ],
    resolve: {
      alias: {
        vue: '@vue/compat',
        '@/': fileURLToPath(new URL('./src/', import.meta.url)),
      },
    },
    server: {
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
