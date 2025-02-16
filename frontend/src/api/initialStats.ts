import apiClient from './config'
import { InitialStats } from './types/initialStats'

export const initialStatsApi = {
  // Aggiunge statistiche iniziali
  addInitialStats: (stats: InitialStats) => {
    return apiClient.post('/initial-stats/add', stats)
  },

  // Ottiene le ultime statistiche
  getLatestStats: () => {
    return apiClient.get<InitialStats>('/initial-stats/latest')
  }
}
