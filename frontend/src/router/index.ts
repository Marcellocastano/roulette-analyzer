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
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/Dashboard.vue'),
        },
        {
          path: 'play',
          name: 'play',
          component: () => import('../views/play/Play.vue'),
          meta: { requiresPremium: true },
        },
        {
          path: 'tutorial',
          name: 'tutorial',
          component: () => import('../views/tutorial/Tutorial.vue'),
          meta: { requiresPremium: true },
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('../views/account/AccountView.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('../views/contact/ContactView.vue'),
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: () => import('../views/pricing/PricingView.vue'),
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('../views/admin/AdminView.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: 'user/:id',
              name: 'userDetail',
              component: () => import('../views/admin/id/UserDetail.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/home',
      name: 'index',
      component: () => import('../views/index/Index.vue'),
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
    {
      path: '/registration-confirm',
      name: 'registrationConfirm',
      component: () => import('../views/signup/RegistrationConfirmView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('../views/forgot-password/ForgotPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/reset-password/:token',
      name: 'resetPassword',
      component: () => import('../views/reset-password/ResetPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/confirm-email/:token',
      name: 'confirmEmail',
      component: () => import('../views/confirm-email/ConfirmEmailView.vue'),
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
  },
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

  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated || !authStore.isAuthAdmin) {
      return next('/dashboard')
    }
  }

  // Controllo accesso per rotte premium
  if (to.meta.requiresPremium && !authStore.isPremiumUser) {
    // Reindirizza alla dashboard se l'utente non ha un abbonamento premium attivo
    return next({
      path: '/dashboard',
      query: { from: 'premium', route: to.name?.toString() },
    })
  }

  next()
})

export default router
