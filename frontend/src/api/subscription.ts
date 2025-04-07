import apiClient from './config'
import { UserSubscription } from './user'

// Estensione dell'interfaccia UserSubscription per includere i dettagli di pagamento
export interface SubscriptionRequest {
  _id: string
  status: 'pending' | 'approved' | 'canceled' | 'rejected'
  type: 'new' | 'renewal' | 'upgrade'
  planId: string
  userId: string
  requestDate: Date
  processedDate: Date | null
  processedBy: string | null
  paymentDetails?: {
    paymentLink: string
    amount: number
  }
  notes?: string | null
  resultingSubscription?: string | null
}

export const subscriptionApi = {
  getUserSubscription: () => apiClient.get('/subscription/current'),
  getUserSubscriptionRequests: () => apiClient.get('/subscription/requests'),
  requestSubscriptionInPending: () => apiClient.get('/subscription/request-in-pending'),
  requestSubscription: (planId: string, type: string = 'new') =>
    apiClient.post<{ success: boolean; data: SubscriptionRequest }>('/subscription/request', {
      planId,
      type,
    }),
  activateTrial: () => apiClient.post<{ success: boolean; data: any; accessToken?: string }>('/subscription/trial'),
  cancelSubscriptionRequest: (requestId: string) =>
    apiClient.delete(`/subscription/request/${requestId}`),
  checkSessionLimit: () => apiClient.get('/subscription/session-limit'),
  incrementSessionCount: () => apiClient.post('/subscription/increment-session'),
}
