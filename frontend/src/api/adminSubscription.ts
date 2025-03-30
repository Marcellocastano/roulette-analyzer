import apiClient from './config'

export const adminSubscriptionApi = {
  getPendingSubscriptionRequests: () => apiClient.get('/admin/subscription/requests/pending'),
  getUserSubscriptionById: (id: string) => apiClient.get(`/admin/subscription/${id}`),
  activateSubscription: (requestId: string) =>
    apiClient.post(`/admin/subscription/activate/${requestId}`),
  rejectSubscriptionRequest: (requestId: string) =>
    apiClient.post(`/admin/subscription/reject/${requestId}`),
  deactivateSubscription: (subscriptionId: string) =>
    apiClient.post(`/admin/subscription/deactivate/${subscriptionId}`),
}
