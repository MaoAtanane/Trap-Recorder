// Local storage utilities for the DTL Shot Tracker application

import type { User, Equipment, Game, Club } from "./types"

// User management
export const saveUser = (user: User): void => {
  localStorage.setItem("dtl-user", JSON.stringify(user))
}

export const getUser = (): User | null => {
  const saved = localStorage.getItem("dtl-user")
  return saved ? JSON.parse(saved) : null
}

export const removeUser = (): void => {
  localStorage.removeItem("dtl-user")
}

// Users database (for registration/login)
export const saveUserToDatabase = (user: User): void => {
  const users = getAllUsers()
  users.push(user)
  localStorage.setItem("dtl-users", JSON.stringify(users))
}

export const getAllUsers = (): User[] => {
  const saved = localStorage.getItem("dtl-users")
  return saved ? JSON.parse(saved) : []
}

export const findUserByEmail = (email: string): User | null => {
  const users = getAllUsers()
  return users.find((user) => user.email === email) || null
}

// Equipment management
export const saveEquipment = (userId: string, equipment: Equipment[]): void => {
  localStorage.setItem(`dtl-equipment-${userId}`, JSON.stringify(equipment))
}

export const getEquipment = (userId: string): Equipment[] => {
  const saved = localStorage.getItem(`dtl-equipment-${userId}`)
  return saved ? JSON.parse(saved) : []
}

export const addEquipment = (userId: string, equipment: Equipment): void => {
  const existing = getEquipment(userId)
  existing.push(equipment)
  saveEquipment(userId, existing)
}

export const removeEquipment = (userId: string, equipmentId: string): void => {
  const existing = getEquipment(userId)
  const filtered = existing.filter((eq) => eq.id !== equipmentId)
  saveEquipment(userId, filtered)
}

// Game management
export const saveGames = (userId: string, games: Game[]): void => {
  localStorage.setItem(`dtl-games-${userId}`, JSON.stringify(games))
}

export const getGames = (userId: string): Game[] => {
  const saved = localStorage.getItem(`dtl-games-${userId}`)
  return saved ? JSON.parse(saved) : []
}

export const addGame = (userId: string, game: Game): void => {
  const existing = getGames(userId)
  existing.push(game)
  // Sort by date descending (newest first)
  existing.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  saveGames(userId, existing)
}

export const removeGame = (userId: string, gameId: string): void => {
  const existing = getGames(userId)
  const filtered = existing.filter((game) => game.id !== gameId)
  saveGames(userId, filtered)
}

// Club management
export const saveClubs = (clubs: Club[]): void => {
  localStorage.setItem("dtl-clubs", JSON.stringify(clubs))
}

export const getClubs = (): Club[] => {
  const saved = localStorage.getItem("dtl-clubs")
  return saved ? JSON.parse(saved) : []
}

export const addClub = (club: Club): void => {
  const existing = getClubs()
  existing.push(club)
  saveClubs(existing)
}

// Utility functions
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const calculateGameScore = (shots: number[]): number => {
  return shots.reduce((total, shot) => total + shot, 0)
}
