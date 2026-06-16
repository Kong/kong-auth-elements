import eslintKongUiConfig from '@kong/eslint-config-kong-ui'
import eslintKongUiConfigCypress from '@kong/eslint-config-kong-ui/cypress'
import designTokens from '@kong/eslint-plugin-design-tokens'

export default [
  ...eslintKongUiConfig,
  // Only apply the shared Cypress config to files that match the given pattern
  ...eslintKongUiConfigCypress.map(config => ({
    ...config,
    files: [
      '**/*.spec.ts',
      '**/cypress/**',
    ],
  })),
  {
    files: ['**/*.vue'],
    plugins: {
      '@kong/design-tokens': designTokens,
    },
    rules: {
      '@kong/design-tokens/token-constant-requires-css-var': 'error',
    },
  },
]
