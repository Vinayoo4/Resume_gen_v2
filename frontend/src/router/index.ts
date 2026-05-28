import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../pages/Login.vue') },
    { path: '/register', component: () => import('../pages/Register.vue') },
    {
      path: '/dashboard',
      component: () => import('../pages/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    { path: '/:slug', component: () => import('../pages/PublicProfile.vue') }
  ]
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    next('/')
  } else if ((to.path === '/' || to.path === '/register') && auth.token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
