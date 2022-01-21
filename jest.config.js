module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    '^vue$': '@vue/compat', // Tell @vue/test-utils to use @vue/compat
    '@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    './dist/',
    './dev/',
  ],
  setupFiles: ['<rootDir>/jest.init.ts'], // Run code on jest init
}
