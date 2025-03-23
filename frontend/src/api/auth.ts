import api from './config'
import type {
  ApiResponse,
  AuthResponse,
  // LoginData,
  RegisterData,
  User,
} from '@/types/auth'

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
}

export const authApi = {
  /**
   * Effettua il login dell'utente
   * @param data - Credenziali dell'utente
   * @returns Promise con i dati dell'utente e il token
   */
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data)
    return response.data.data
  },

  /**
   * Registra un nuovo utente
   * @param data - Dati di registrazione dell'utente
   * @returns Promise con i dati dell'utente e il token
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data
  },

  /**
   * Effettua il logout dell'utente
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  /**
   * Aggiorna il token di accesso
   * @param refreshToken - Il token di refresh
   * @returns Promise con il nuovo token di accesso e opzionalmente un nuovo token di refresh
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data.data
  },

  /**
   * Richiede il reset della password
   * @param data - Dati per il recupero password (email)
   * @returns Promise con il messaggio di successo
   */
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)
    return response.data.data
  },

  /**
   * Reimposta la password con il token di reset
   * @param token - Token di reset password
   * @param data - Nuova password
   * @returns Promise con il messaggio di successo
   */
  resetPassword: async (token: string, data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(`/auth/reset-password/${token}`, data)
    return response.data.data
  },
}
