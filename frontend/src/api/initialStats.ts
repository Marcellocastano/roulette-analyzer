import apiClient from './config'
import type {
  InitialStatsPayload,
  InitialStatsPayloadAdvanced,
  InitialStatsApiResponse,
  InitialStatsResponse,
} from './types/initialStats'
import type { ApiResponse } from '@/types/api'

export const initialStatsApi = {
  submitStats: (stats: InitialStatsPayload) => {
    return apiClient.post<ApiResponse<InitialStatsResponse>>('/initial-stats/add', stats)
  },

  submitAdvancedStats: (stats: InitialStatsPayloadAdvanced) => {
    return apiClient.post<ApiResponse<InitialStatsResponse>>('/initial-stats/add-advanced', stats)
  },

  // Ottiene le ultime statistiche
  getLatestStats: () => {
    return apiClient.get<ApiResponse<InitialStatsResponse>>('/initial-stats/latest')
  },
}
