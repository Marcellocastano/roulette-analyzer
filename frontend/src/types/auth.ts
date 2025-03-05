export interface Subscription {
  plan: 'free' | 'premium'
  duration: 'monthly' | 'annual' | null
  startDate: string | null
  endDate: string | null
  status: 'unset' | 'active' | 'expired' | 'pending'
}

export interface User {
  id: string
  email: string
  name: string
  subscription: Subscription
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  name: string
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
