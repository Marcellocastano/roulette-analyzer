import apiClient from './config'

export interface Plan {
  _id: string
  name: string
  type: string
  duration: string
  durationValue: number
  price: {
    amount: number
    currency: string
  }
  status: string
  features: string[]
  sessions: {
    total: number
    perDay: number
  }
  paymentLink?: string
  isActive: boolean
}

export const planApi = {
  getPlans: () => apiClient.get<{ success: boolean, data: Plan[] }>('/plans'),
}