import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { userApi } from '@/api/user'
import router from '@/router'
import type { User, LoginData, RegisterData } from '@/types/auth'
import { subscriptionApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAuthAdmin = computed(() => user.value?.role === 'admin')
  const userSubscription = computed(() => user.value?.subscription)
  const isPremiumUser = computed(() => {
    if (!user.value?.activeSubscription) return false
    return user.value.activeSubscription
  })

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
        subscriptionApi.getUserSubscription(),
      ])

      // Estraiamo i dati dalla risposta
      const profileData = profileResponse.data.data
      const subscriptionData = subscriptionResponse.data.data

      const userData: User = {
        _id: profileData._id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
        lastLogin: profileData.lastLogin,
        activeSubscription: profileData.activeSubscription,
        isTrialUsed: profileData.isTrialUsed,
        subscription: subscriptionData,
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

      // Salva il refresh token nel localStorage
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }

      const userData = response.user
      setUser({
        _id: userData._id,
        email: userData.email,
        name: userData.name,
        subscription: userData.subscription,
        role: userData.role,
        lastLogin: userData.lastLogin,
        activeSubscription: userData.activeSubscription,
        isTrialUsed: userData.isTrialUsed,
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

  const register = async (data: RegisterData) => {
    loading.value = true
    try {
      const response = await authApi.register(data)
      return response
    } catch (error) {
      console.error('Registration error:', error)
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
      localStorage.removeItem('refreshToken') // Rimuovi anche il refresh token
      router.push('/login')
    }
  }

  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (!storedRefreshToken) {
        console.error('Refresh token non trovato nel localStorage')
        setToken(null)
        setUser(null)
        return false
      }

      const response = await authApi.refreshToken(storedRefreshToken)
      setToken(response.accessToken)

      // Salva il nuovo refresh token se presente
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      setToken(null)
      setUser(null)
      localStorage.removeItem('refreshToken')
      return false
    }
  }

  const updateUserInfo = (userData: any) => {
    if (!user.value) return

    // Aggiorna solo i campi forniti
    const updatedUser: User = {
      ...user.value,
      name: userData.name || user.value.name,
      email: userData.email || user.value.email,
      // Mantieni la subscription esistente
      subscription: user.value.subscription,
    }

    setUser(updatedUser)
  }

  return {
    // State
    user,
    token,
    loading,

    // Getters
    isAuthenticated,
    userSubscription,
    isPremiumUser,
    isAuthAdmin,

    // Actions
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
    updateUserInfo,
  }
})
