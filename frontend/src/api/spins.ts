import apiClient from './config'

export interface Spin {
  id: string
  number: number
}

export const spinsApi = {
  // Aggiunge un nuovo spin
  addSpin: (spin: Omit<Spin, 'id'>) => {
    return apiClient.post<Spin>('/spins', spin)
  },

  // Ottiene gli spin recenti
  getRecentSpins: () => {
    return apiClient.get<Spin[]>('/spins/recent')
  },

  // Ottiene la storia degli spin
  getSpinHistory: () => {
    return apiClient.get<Spin[]>('/spins/history')
  },

  // Elimina uno spin
  deleteSpin: (id: string) => {
    return apiClient.delete(`/spins/${id}`)
  },

  // Ottiene gli spin di una sessione specifica
  getSessionSpins: (sessionId: string) => {
    return apiClient.get<Spin[]>(`/spins/session/${sessionId}`)
  },

  // Ottiene le statistiche delle dozzine
  getDozensStats: () => {
    return apiClient.get('/spins/stats/dozens')
  },

  // Ottiene le statistiche dei vicini dello zero
  getZeroNeighborsStats: () => {
    return apiClient.get('/spins/stats/zero-neighbors')
  },
}
