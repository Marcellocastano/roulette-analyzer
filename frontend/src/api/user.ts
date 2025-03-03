import apiClient from './config'
import type { User } from '@/types/auth'

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
}

export interface UserProfile {
  id: string
  email: string
  name: string
  lastLogin?: string
  preferences?: Record<string, any>
}

export interface UserSubscription {
  features: {
    maxSpins: number
    predictions: boolean
    advancedStats: boolean
  }
  plan: 'free' | 'premium' | 'pro'
  status: 'active' | 'inactive' | 'expired'
}

export const userApi = {
  // Ottiene il profilo dell'utente
  getProfile: () => {
    return apiClient.get<ApiResponse<UserProfile>>('/users/profile')
  },

  // Aggiorna il profilo dell'utente
  updateProfile: (profile: Partial<UserProfile>) => {
    return apiClient.put<ApiResponse<UserProfile>>('/users/profile', profile)
  },

  // Cambia la password dell'utente
  changePassword: (oldPassword: string, newPassword: string) => {
    return apiClient.post<ApiResponse<{ message: string }>>('/users/change-password', {
      oldPassword,
      newPassword
    })
  },

  // Ottiene le informazioni sull'abbonamento
  getSubscription: () => {
    return apiClient.get<ApiResponse<UserSubscription>>('/users/subscription')
  },
}
