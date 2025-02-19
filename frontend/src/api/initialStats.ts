import apiClient from './config'
import type { InitialStatsPayload, InitialStatsApiResponse } from './types/initialStats'

export const initialStatsApi = {
  submitStats: (stats: InitialStatsPayload) => {
    return apiClient.post<InitialStatsApiResponse>('/initial-stats/add', stats)
  },

  // Ottiene le ultime statistiche
  getLatestStats: () => {
    return apiClient.get<InitialStatsPayload>('/initial-stats/latest')
  }
}
