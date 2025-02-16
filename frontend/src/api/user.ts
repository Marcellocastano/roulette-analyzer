import apiClient from './config'

export interface UserProfile {
  id: string
  email: string
  name: string
  preferences?: Record<string, any>
}

export interface Subscription {
  status: string
  expiresAt: string
  plan: string
}

export const userApi = {
  // Ottiene il profilo dell'utente
  getProfile: () => {
    return apiClient.get<UserProfile>('/user/profile')
  },

  // Aggiorna il profilo dell'utente
  updateProfile: (profile: Partial<UserProfile>) => {
    return apiClient.put<UserProfile>('/user/profile', profile)
  },

  // Ottiene le informazioni sull'abbonamento
  getSubscription: () => {
    return apiClient.get<Subscription>('/user/subscription')
  }
}
