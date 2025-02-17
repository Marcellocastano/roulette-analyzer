import apiClient from './config'
import { InitialStatsPayload } from './types/initialStats'

export const initialStatsApi = {
  // Aggiunge statistiche iniziali
  addInitialStats: (stats: InitialStatsPayload) => {
    return apiClient.post('/initial-stats/add', stats)
  },

  // Ottiene le ultime statistiche
  getLatestStats: () => {
    return apiClient.get<InitialStatsPayload>('/initial-stats/latest')
  }
}
