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
    0: number
    3: number
    12: number
    15: number
    26: number
    32: number
    35: number
}