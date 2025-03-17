export interface Subscription {
  plan: 'free' | 'premium'
  duration: 'monthly' | 'annual' | null
  startDate: string | null
  endDate: string | null
  status: 'unset' | 'active' | 'expired' | 'pending'
  newRequest: {
    status: 'unset' | 'active' | 'expired' | 'pending'
    duration: 'monthly' | 'annual' | null
  } | null
}

export interface User {
  _id: string
  email: string
  name: string
  subscription: Subscription
  role: 'admin' | 'user'
  // createdAt: string
  // updatedAt: string
  // lastLogin: string
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
