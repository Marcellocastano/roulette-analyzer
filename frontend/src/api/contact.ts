import apiClient from './config'
import type { ApiResponse } from '@/types/api'

export interface Feedback {
  category: string
  message: string
}

export const contactApi = {
  // Aggiunge un nuovo feedback
  addFeedback: (feedback: Feedback) => {
    return apiClient.post<ApiResponse<Feedback>>('/contact/feedback', feedback)
  },
}
