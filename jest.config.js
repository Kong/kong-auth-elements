module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  reporters: ['default', 'jest-junit'],
  // Tell @vue/test-utils to use @vue/compat
  moduleNameMapper: { '^vue$': '@vue/compat' },
}
