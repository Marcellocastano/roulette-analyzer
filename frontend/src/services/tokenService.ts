import apiClient from '../api/config'
import { ref } from 'vue'

// Stato per tenere traccia del timer di refresh
const refreshTimerId = ref<number | null>(null)

// Calcola il tempo in millisecondi prima della scadenza del token
const getTimeUntilExpiry = (token: string): number => {
  try {
    // Decodifica il payload del token (parte centrale del JWT)
    const payload = JSON.parse(atob(token.split('.')[1]))
    // Calcola il tempo rimanente in millisecondi
    const expiryTime = payload.exp * 1000 // exp è in secondi, convertiamo in millisecondi
    const currentTime = Date.now()
    return Math.max(0, expiryTime - currentTime)
  } catch (error) {
    console.error('Errore nella decodifica del token:', error)
    return 0
  }
}

// Imposta un timer per refreshare il token prima che scada
const setupRefreshTimer = () => {
  // Cancella eventuali timer esistenti
  if (refreshTimerId.value) {
    clearTimeout(refreshTimerId.value)
  }

  const token = localStorage.getItem('token')
  if (!token) return

  // Calcola quando refreshare il token (10 minuti prima della scadenza)
  const timeUntilExpiry = getTimeUntilExpiry(token)
  const refreshTime = Math.max(0, timeUntilExpiry - 10 * 60 * 1000) // 10 minuti prima

  console.log(
    `Token scadrà tra ${Math.round(timeUntilExpiry / 60000)} minuti. Refresh pianificato tra ${Math.round(refreshTime / 60000)} minuti.`
  )

  // Imposta il timer per il refresh
  refreshTimerId.value = window.setTimeout(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        console.error('Refresh token non trovato')
        return
      }

      const response = await apiClient.post('/auth/refresh', { refreshToken })

      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)

        // Se c'è un nuovo refresh token, salviamolo
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }

        // Imposta un nuovo timer per il prossimo refresh
        setupRefreshTimer()
      }
    } catch (error) {
      console.error('Errore durante il refresh del token:', error)
      // In caso di errore, reindirizza al login
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  }, refreshTime)
}

// Inizializza il servizio di refresh del token
const initTokenRefresh = () => {
  // Avvia il timer di refresh se c'è un token
  setupRefreshTimer()

  // Aggiungi un listener per gli eventi di storage per sincronizzare tra tab
  window.addEventListener('storage', (event) => {
    if (event.key === 'token' && event.newValue) {
      setupRefreshTimer()
    }
  })
}

export { initTokenRefresh, setupRefreshTimer }
