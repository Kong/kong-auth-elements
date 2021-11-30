module.exports = {
  css: { extract: false },
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3,
              COMPILER_SFC_FUNCTIONAL: true,
              INSTANCE_SCOPED_SLOTS: true
            },
            isCustomElement: tag => tag.startsWith('kong-')
          }
        }
      })
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
