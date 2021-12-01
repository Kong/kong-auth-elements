import { createRouter, createMemoryHistory, RouteRecordRaw, RouteRecordName } from 'vue-router'

import LoginView from '@/views/Login.vue'
import RegisterView from '@/views/Register.vue'
import ForgotPasswordView from '@/views/ForgotPassword.vue'
import ResetPasswordView from '@/views/ResetPassword.vue'
import NotFound from '@/views/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Register'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: {
      title: 'Forgot Password'
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: '/:pathMatch(.*)',
    component: NotFound,
    name: '404',
    meta: {
      title: 'Page Not Found'
    }
  }
]

const isValidRouteName = (name: RouteRecordName): boolean => {
  return routes.map((route: RouteRecordRaw) => route.name).includes(name)
}

const router = createRouter({
  history: createMemoryHistory('/'),
  routes
})

export default router

export {
  routes,
  isValidRouteName
}
