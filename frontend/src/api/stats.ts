import apiClient from './config'

export interface AddSpinPayload {
  number: number
}

export interface Prediction {
  data: {
    primary: number[]
    secondary: number[]
    special: number[]
    lastNumber: number
  }
}

export const statsApi = {
  // Aggiunge uno spin alle statistiche
  addSpin: (spin: AddSpinPayload) => {
    return apiClient.post('/stats/spin', spin)
  },

  // Ottiene le previsioni basate sulle statistiche correnti
  getPredictions: () => {
    return apiClient.get<Prediction>('/stats/predictions')
  },

  // Resetta la sessione corrente
  resetSession: () => {
    return apiClient.get('/stats/reset')
  }
}
