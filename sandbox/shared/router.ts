import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PageView from './PageView.vue'

const pageRoutes = [
  'login',
  'forgot-password',
  'reset-password',
  'change-password',
  'register',
  'accept-invitation',
]

const routes: RouteRecordRaw[] = []

pageRoutes.forEach((routePath: string) => {
  if (routePath === 'login') {
    routes.push({
      path: '/login/:login_path?',
      name: routePath,
      component: PageView,
    })
    return
  }

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
