import type { ApiResponse } from '../user'

export type TableStatus = 'recommended' | 'not_recommended' | 'borderline'

interface DozensStats {
  first: number
  second: number
  third: number
}

interface ZeroNeighborsStats {
  percentage: number
}

interface SpinStats {
  dozens: DozensStats
  zeroNeighbors: ZeroNeighborsStats
}

interface ZeroZoneNumber {
  number: number
  increasePercentage: number
  _id: string
}

interface Analysis {
  tableStatus: TableStatus
  reasons?: string[]
  reasonCodes?: string[]
  increasingNumbers?: number[]
}

export interface InitialStatsResponse {
  userId: string
  stats50: SpinStats
  stats500: SpinStats
  zeroZoneNumbers: ZeroZoneNumber[]
  dozenDown: number
  analysis: Analysis
  _id: string
  timestamp: string
}

export type InitialStatsApiResponse = ApiResponse<InitialStatsResponse>

export interface InitialStatsPayload {
    stats50: Stats
    stats500: Stats
}

export interface Stats {
    dozens: Dozens
    zeroNeighbors: number
    numbers: Numbers
}

export interface Dozens {
    first: number
    second: number
    third: number
}

export interface Numbers {
    [key: string]: number
}

// Costante per i numeri della zona zero
export const ZERO_ZONE_NUMBERS = ['12', '35', '3', '26', '0', '32', '15'];