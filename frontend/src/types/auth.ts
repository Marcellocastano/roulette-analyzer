export interface Subscription {
  features: {
    maxSpins: number
    predictions: boolean
    advancedStats: boolean
  }
  plan: 'free' | 'premium' | 'pro'
  status: 'active' | 'inactive' | 'expired'
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
