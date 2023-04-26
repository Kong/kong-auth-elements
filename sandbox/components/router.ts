import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PageView from './PageView.vue'

const componentRoutes = [
  'login',
  'forgot-password',
  'reset-password',
  'change-password',
  'register',
  'accept-invitation',
]

const routes: RouteRecordRaw[] = []

componentRoutes.forEach((routePath: string) => {
  routes.push({
    path: routePath,
    name: routePath,
    component: PageView,
  })
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'login' },
      children: routes,
    },
  ],
})

export default router
