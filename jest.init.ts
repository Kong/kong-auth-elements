import { config } from '@vue/test-utils'

// Suppress @vue/compat warnings just for tests
config.global.config.warnHandler = (msg) => {
  if (msg.includes('compatConfig')) {
    return null
  }
}
