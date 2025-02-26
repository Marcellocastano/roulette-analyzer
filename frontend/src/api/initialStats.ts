import apiClient from './config'
import type {
  InitialStatsPayload,
  InitialStatsApiResponse,
  InitialStatsResponse,
} from './types/initialStats'
import type { ApiResponse } from './user'

export const initialStatsApi = {
  submitStats: (stats: InitialStatsPayload) => {
    return apiClient.post<ApiResponse<InitialStatsResponse>>('/initial-stats/add', stats)
  },

  // Ottiene le ultime statistiche
  getLatestStats: () => {
    return apiClient.get<ApiResponse<InitialStatsResponse>>('/initial-stats/latest')
  },
}
