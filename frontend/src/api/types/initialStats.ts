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