import apiClient from './config'
import type { ApiResponse } from '@/types/api'

export interface Spin {
  _id: string
  number: number
  user: string
  sessionId: string
  metadata: {
    dozen: 'first' | 'second' | 'third'
    isZeroNeighbor: boolean
    color: 'red' | 'black' | 'green'
    isEven: boolean
  }
  createdAt: string
  updatedAt: string
}

// Tipo per l'input di addSpin - solo il numero è richiesto
interface AddSpinInput {
  number: number
}

export const spinsApi = {
  // Aggiunge un nuovo spin
  addSpin: (spin: AddSpinInput) => {
    return apiClient.post<ApiResponse<Spin>>('/spins', spin)
  },

  // Ottiene gli spin recenti
  getLastSpin: () => {
    return apiClient.get<ApiResponse<Spin>>('/spins/last')
  },

  // Ottiene la storia degli spin
  getSpinHistory: () => {
    return apiClient.get<ApiResponse<Spin[]>>('/spins/history')
  },

  // Elimina uno spin
  deleteSpin: (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/spins/${id}`)
  },

  // Ottiene gli spin di una sessione specifica
  getSessionSpins: (sessionId: string) => {
    return apiClient.get<ApiResponse<Spin[]>>(`/spins/session/${sessionId}`)
  },

  // Ottiene le statistiche delle dozzine
  getDozensStats: () => {
    return apiClient.get<ApiResponse<any>>('/spins/stats/dozens')
  },

  // Ottiene le statistiche dei vicini dello zero
  getZeroNeighborsStats: () => {
    return apiClient.get<ApiResponse<any>>('/spins/stats/zero-neighbors')
  },
}
