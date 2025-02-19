import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { userApi } from '@/api/user'
import router from '@/router'
import type { User, LoginData } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userSubscription = computed(() => user.value?.subscription)
  const hasAdvancedFeatures = computed(() => userSubscription.value?.features.advancedStats ?? false)
  const hasPredictions = computed(() => userSubscription.value?.features.predictions ?? false)
  const maxSpins = computed(() => userSubscription.value?.features.maxSpins ?? 50)

  // Actions
  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (newUser: User | null) => {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  const checkAuthStatus = async () => {
    if (!token.value) {
      return false
    }

    try {
      const [profileResponse, subscriptionResponse] = await Promise.all([
        userApi.getProfile(),
        userApi.getSubscription()
      ])

      // Estraiamo i dati dalla risposta
      const profileData = profileResponse.data.data
      const subscriptionData = subscriptionResponse.data.data

      const userData: User = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        subscription: {
          status: subscriptionData.status,
          plan: subscriptionData.plan,
          features: subscriptionData.features
        }
      }

      setUser(userData)
      return true
    } catch (error: any) {
      if (error.response?.status === 403) {
        setToken(null)
        setUser(null)
        router.push('/login')
      }
      return false
    }
  }

  const login = async (credentials: LoginData) => {
    loading.value = true
    try {
      const response = await authApi.login(credentials)
      console.log(response)
      setToken(response.accessToken)
      const userData = response.user
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        subscription: userData.subscription
      })
      return true
    } catch (error) {
      console.error('Login error:', error)
      setToken(null)
      setUser(null)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      router.push('/login')
    }
  }

  const refreshToken = async () => {
    try {
      const newToken = await authApi.refreshToken()
      setToken(newToken)
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      setToken(null)
      setUser(null)
      return false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    userSubscription,
    hasAdvancedFeatures,
    hasPredictions,
    maxSpins,
    
    // Actions
    login,
    logout,
    refreshToken,
    checkAuthStatus
  }
})
