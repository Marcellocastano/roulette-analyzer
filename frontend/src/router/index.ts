import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/Dashboard.vue'),
        },
        {
          path: 'play',
          name: 'play',
          component: () => import('../views/play/Play.vue'),
        },
        {
          path: 'tutorial',
          name: 'tutorial',
          component: () => import('../views/tutorial/Tutorial.vue'),
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('../views/account/AccountView.vue'),
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: () => import('../views/pricing/PricingView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/signup/SignupView.vue'),
      meta: { requiresAuth: false },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Se la rotta non richiede autenticazione, procedi
  if (!to.meta.requiresAuth) {
    return next()
  }

  // Verifica lo stato dell'autenticazione
  const isAuthenticated = await authStore.checkAuthStatus()

  // Se la rotta richiede autenticazione e l'utente non è autenticato
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Se l'utente è autenticato e prova ad accedere al login
  if (to.path === '/login' && isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router
