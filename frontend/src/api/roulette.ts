import api from './config'

interface StatisticsParams {
  spins?: number  // numero di spin da analizzare (default: 500)
}

interface NumberStats {
  number: number
  frequency: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

interface DozenStats {
  dozen: number        // 1, 2, o 3
  frequency: number
  percentage: number
  isUnderperforming: boolean  // true se sotto il 27-28%
}

interface ZeroZoneStats {
  frequency: number
  percentage: number
  isUnderperforming: boolean  // true se sotto il 20%
  numbers: NumberStats[]      // statistiche dei numeri nella zona zero (0,12,13,14,15)
}

interface HotColdStats {
  hot: NumberStats[]    // numeri più frequenti
  cold: NumberStats[]   // numeri meno frequenti
}

interface SequenceStats {
  number: number
  followingNumbers: number[]
  frequency: number
}

export const rouletteApi = {
  // Statistiche generali
  getStatistics: (params?: StatisticsParams) => 
    api.get('/roulette/statistics', { params }),

  // Statistiche delle dozzine
  getDozenStats: (params?: StatisticsParams) => 
    api.get('/roulette/dozens', { params }),

  // Statistiche della zona zero
  getZeroZoneStats: (params?: StatisticsParams) => 
    api.get('/roulette/zero-zone', { params }),

  // Numeri caldi e freddi
  getHotColdNumbers: (params?: StatisticsParams) => 
    api.get('/roulette/hot-cold', { params }),

  // Analisi delle sequenze
  getSequenceAnalysis: () => 
    api.get('/roulette/sequences'),

  // Storico numeri usciti
  getHistory: (limit: number = 500) => 
    api.get('/roulette/history', { params: { limit } }),

  // Aggiungere un nuovo numero
  addNumber: (number: number) => 
    api.post('/roulette/numbers', { number }),

  // Analisi dei trend
  analyzeTrends: (params?: StatisticsParams) => 
    api.get('/roulette/trends', { params }),

  // Identificazione numeri focal
  getFocalNumbers: () => 
    api.get('/roulette/focal-numbers'),

  // Suggerimenti per le puntate
  getBettingSuggestions: () => 
    api.get('/roulette/betting-suggestions')
}
