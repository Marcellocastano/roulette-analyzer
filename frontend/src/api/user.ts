import apiClient from './config'
import type { User } from '@/types/auth'
import type { ApiResponse } from '@/types/api'

export interface UserProfile {
  _id: string
  email: string
  name: string
  role: 'admin' | 'user'
  lastLogin?: string
  preferences?: Record<string, any>
  subscription?: UserSubscription
}

export interface UserSubscription {
  plan: 'free' | 'premium'
  status: 'active' | 'unset' | 'expired' | 'pending'
  duration: 'monthly' | 'annual' | null
  startDate: string | null
  endDate: string | null
  newRequest: {
    status: 'unset' | 'active' | 'pending'
    duration: 'monthly' | 'annual'
  } | null
}

export interface PaymentInstructions {
  paypalEmail: string
  amount: number
  currency: string
  reference: string
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
  
  // Richiede un nuovo abbonamento
  requestSubscription: (plan: string, duration: string) => {
    return apiClient.post<ApiResponse<{ paymentInstructions: PaymentInstructions }>>('/users/subscription/request', {
      plan,
      duration
    })
  },
  
  // Annulla una richiesta di abbonamento
  cancelSubscriptionRequest: () => {
    return apiClient.post<ApiResponse<{ message: string }>>('/users/subscription/cancel')
  },
}
