import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home.ce.vue'
import About from '@/views/About.ce.vue'
import Login from '@/views/Login.ce.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createMemoryHistory('/'),
  routes
})

export default router
