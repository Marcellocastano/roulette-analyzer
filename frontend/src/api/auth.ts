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
  user: User
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
   * @returns Promise con il nuovo token
   */
  refreshToken: async (): Promise<string> => {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
    return response.data.data.accessToken
  },
}
