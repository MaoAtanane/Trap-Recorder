// Core data types for the DTL Shot Tracker application

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface Equipment {
  id: string
  userId: string
  name: string
  type: "gun" | "choke" | "cartridge"
  details: string
  createdAt: string
}

export interface Club {
  id: string
  name: string
  location: string
  createdAt: string
}

export interface Game {
  id: string
  userId: string
  date: string
  clubName: string
  equipment: {
    gun: string
    choke: string
    cartridge: string
  }
  shots: number[] // Array of 25 shots: 3 = hit first, 2 = hit second, 0 = miss
  totalScore: number
  notes?: string
  createdAt: string
}

export interface GameStats {
  totalGames: number
  averageScore: number
  bestScore: number
  worstScore: number
  firstBarrelHits: number
  secondBarrelHits: number
  misses: number
  firstBarrelPercentage: number
  secondBarrelPercentage: number
  hitPercentage: number
}

// DTL Scoring constants
export const DTL_SCORING = {
  HIT_FIRST: 3,
  HIT_SECOND: 2,
  MISS: 0,
  MAX_SCORE: 75, // 25 shots × 3 points
  SHOTS_PER_ROUND: 25,
} as const

export type ShotResult = typeof DTL_SCORING.HIT_FIRST | typeof DTL_SCORING.HIT_SECOND | typeof DTL_SCORING.MISS
