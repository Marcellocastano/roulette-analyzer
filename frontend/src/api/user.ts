import apiClient from './config'
import type { User } from '@/types/auth'
import type { ApiResponse } from '@/types/api'

export interface UserProfile {
  _id: string
  email: string
  name: string
  role: 'admin' | 'user'
  lastLogin: string
  isTrialUsed: boolean
  activeSubscription: string | null
}

export interface Session {
  count: number
  lastReset: string
}

export interface UserSubscription {
  plan: 'free' | 'premium'
  status: 'active' | 'unset' | 'expired' | 'pending'
  duration: 'monthly' | 'annual' | null
  startDate: string | null
  endDate: string | null
  sessions: Session
  name: string
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
      newPassword,
    })
  },

  // Ottiene le informazioni sull'abbonamento
  getSubscription: () => {
    return apiClient.get<ApiResponse<UserSubscription>>('/users/subscription')
  },

  // Richiede un nuovo abbonamento
  requestSubscription: (duration: string) => {
    return apiClient.post<ApiResponse<{ subscription: UserSubscription }>>(
      '/users/subscription/request',
      {
        duration,
      }
    )
  },

  // Annulla una richiesta di abbonamento
  cancelSubscriptionRequest: () => {
    return apiClient.post<ApiResponse<{ message: string }>>('/users/subscription/cancel')
  },
  // Attiva un abbonamento di prova
  activateTrial: () => {
    return apiClient.post<ApiResponse<{ message: string }>>('/users/subscription/trial')
  },
}
