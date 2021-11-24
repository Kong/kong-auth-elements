import { createApp } from 'vue'
import DevApp from './DevApp.vue'

// Auto-registers kong-auth custom element
import '@/index'

const devApp = createApp(DevApp)

devApp.mount('#app')
