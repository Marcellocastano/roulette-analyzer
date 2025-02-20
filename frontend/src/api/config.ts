// Configurazione base per axios
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/v1', // Usiamo un path relativo invece dell'URL completo
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Importante per gestire i cookie di sessione
})

// Interceptor per gestire i token di autenticazione
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor per gestire gli errori di risposta
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data)
    return response
  },
  error => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    })

    if (error.response?.status === 401) {
      // Gestione token scaduto
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
