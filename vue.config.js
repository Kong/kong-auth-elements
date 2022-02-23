module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_AUTH_URL,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
      '^/kauth/api': {
        target: process.env.VUE_APP_AUTH_URL,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  css: { extract: false },
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3,
              COMPILER_SFC_FUNCTIONAL: true,
              INSTANCE_SCOPED_SLOTS: true,
            },
            // If an app is registering custom elements, their Vue app would need this setting enabled without the 'SERVE_MODE' check
            // SERVE_MODE logic is only used here for the dev servers running out of the /dev directory
            isCustomElement: (tag) => process.env.SERVE_MODE === 'elements' && tag.startsWith('kong-auth'),
          },
        }
      })
  },
  configureWebpack: {
    output: {
      libraryExport: 'default',
    },
  },
  transpileDependencies: [/@kongponents\/.*/],
}
