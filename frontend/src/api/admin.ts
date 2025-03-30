import type { ApiResponse } from '@/types/api'
import { SubscriptionRequest, User } from '@/types/auth'
import apiClient from './config'

export const adminApi = {
  // Ottiene tutti gli utenti
  getUsers: () => {
    return apiClient.get<ApiResponse<User[]>>('/admin/users')
  },

  // Ottiene un utente per id
  getUserById: (id: string) => {
    return apiClient.get<ApiResponse<User>>('/admin/users/' + id)
  },

  // Cambia la password dell'utente
  activateSubscription: (id: string) => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/admin/users/' + id + '/activate-subscription'
    )
  },
  deactivateSubscription: (id: string) => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/admin/users/' + id + '/deactivate-subscription'
    )
  },
  getUserRequestPending: (id: string) => {
    return apiClient.get<ApiResponse<SubscriptionRequest[]>>(
      '/admin/users/' + id + '/request/pending'
    )
  },
}
