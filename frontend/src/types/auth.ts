export interface Subscription {
  _id?: string
  plan: 'free' | 'premium'
  duration: 'monthly' | 'annual' | null
  startDate: string | null
  endDate: string | null
  status: 'unset' | 'active' | 'expired' | 'pending'
  requestId?: string
  newRequest: {
    _id?: string
    status: 'unset' | 'active' | 'expired' | 'pending'
    duration: 'monthly' | 'annual' | null
  } | null
}

export interface SubscriptionRequest {
  _id: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  type: 'new' | 'renewal' | 'upgrade'
  requestDate: string
  processedDate?: string
  plan: string
  duration: 'monthly' | 'annual' | null
  resultingSubscription?: string | null
}

export interface User {
  _id: string
  email: string
  name: string
  subscription: Subscription
  activeSubscription: string | null
  role: 'admin' | 'user'
  lastLogin: string
  isTrialUsed: boolean
  pendingRequest?: SubscriptionRequest
  approvedRequest?: SubscriptionRequest
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  name: string
  recaptchaToken?: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface TokenPayload {
  id: string
  email: string
  role: string
  subscription: string
  iat: number
  exp: number
}
