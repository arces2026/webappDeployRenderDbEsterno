import DetailView from '@/views/DetailView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProductsView from '@/views/ProductsView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UsersView from '@/views/UsersView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { jwtDecode } from 'jwt-decode'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // L'URL del browser
      name: 'home', // Un nome univoco per la rotta (opzionale ma consigliato)
      component: HomeView,
      meta: { requiresAuth: true }, // Il componente associato
    },
    {
      path: '/detail/:id', // L'URL del browser
      name: 'detail', // Un nome univoco per la rotta (opzionale ma consigliato)
      component: DetailView, // Il componente associato
    },
    {
      path: '/products', // L'URL del browser
      name: 'products', // Un nome univoco per la rotta (opzionale ma consigliato)
      component: ProductsView, // Il componente associato
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
})

// --- IL CONTROLLO ACCESSI (Navigation Guard) ---
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    // First check if there's a token
    if (!authStore.isAuthenticated) {
      return '/login'
    }

    // Optional: Validate token expiration
    const token = localStorage.getItem('access_token')
    // const token = localStorage.getItem('access_token')
    try {
      const decoded = jwtDecode(token)
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        // Token expired
        authStore.logout()
        return '/login'
      }
    } catch (error) {
      // Invalid token
      authStore.logout()
      return '/login'
    }
  }

  // Redirect authenticated users from auth pages
  if (to.path === '/login' || to.path === '/register') {
    if (authStore.isAuthenticated) {
      return '/'
    }
  }

  return true
})

export default router
