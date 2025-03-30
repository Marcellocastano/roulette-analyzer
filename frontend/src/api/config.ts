// Configurazione base per axios
import axios from 'axios'
import env from '../config/env'

// Costruisci l'URL base in base all'ambiente
const baseURL = `${env.apiBaseUrl}/v1`

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Importante per gestire i cookie di sessione
})

// Interceptor per gestire i token di autenticazione
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor per gestire gli errori di risposta
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    })

    if (error.response?.status === 401) {
      // Gestione token scaduto
      const refreshToken = localStorage.getItem('refreshToken')

      // Se abbiamo un refresh token, proviamo a rinnovare il token
      if (refreshToken) {
        return apiClient
          .post('/auth/refresh', { refreshToken })
          .then((response) => {
            if (response.data && response.data.accessToken) {
              // Salva il nuovo token
              localStorage.setItem('token', response.data.accessToken)

              // Se c'è un nuovo refresh token, salviamolo
              if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken)
              }

              // Riprova la richiesta originale con il nuovo token
              const originalRequest = error.config
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
              return axios(originalRequest)
            }
          })
          .catch((refreshError) => {
            console.error('Errore nel refresh del token:', refreshError)
            // Se il refresh fallisce, reindirizza al login
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          })
      } else {
        // Se non abbiamo un refresh token, reindirizza al login
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
