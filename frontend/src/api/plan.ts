import apiClient from './config'

export interface Plan {
  _id: string
  name: string
  type: string
  duration: {
    type: string
    value: number
  }
  price: {
    amount: number
    currency: string
  }
  status: string
  rules: {
    sessions: number
    spins: number
    prediction: string
  }
  paymentLink?: string
  isActive: boolean
}

export const planApi = {
  getPlans: () => apiClient.get<{ success: boolean; data: Plan[] }>('/plans'),
}
