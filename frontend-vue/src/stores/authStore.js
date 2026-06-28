import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { post } from '@/plugins/api'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  // Helper function to extract user from token
  function getUserFromToken(tokenValue) {
    try {
      const decoded = jwtDecode(tokenValue)
      // Log the full decoded token to see what's available
      console.log('Decoded JWT:', decoded)
      // Your token structure:
      // { token_type: 'access', exp: 1782580601, iat: 1782577001, jti: '...', user_id: '1' }

      return {
        id: decoded.user_id,
        // Since username and email aren't in the token,
        // you'll need to fetch them separately or get them from the login response
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  function setAuth(data) {
    // Fix: Use consistent key names
    token.value = data.access
    refreshToken.value = data.refreshToken // Make sure this matches your API response
    // user.value = data.user || null

    // Decode token to get user info
    user.value = getUserFromToken(data.access)

    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function clearAuth() {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  async function login(username, password) {
    try {
      const data = await post('/api/v1/login/', { username, password })
      setAuth(data)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function register(userData) {
    try {
      const data = await post('/api/v1/register/', userData)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    clearAuth()
  }

  // Initialize user from localStorage if token exists
  if (token.value) {
    user.value = getUserFromToken(token.value)
  }

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    getAuthHeader,
    setAuth,
    clearAuth,
  }
})
