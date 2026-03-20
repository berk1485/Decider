export interface Restaurant {
  id: string
  name: string
  rating: number
  address: string
  distance: string
  priceLevel?: number
  photoUrl?: string
  types?: string[]
  lat: number
  lng: number
}

export interface DishSuggestion {
  dish: string
  cuisine: string
  description: string
  restaurant?: Restaurant
}

export interface MealPlan {
  title: string
  courses: Course[]
  shoppingList: ShoppingItem[]
  timeline: TimelineStep[]
  platingNotes: string[]
}

export interface Course {
  name: string
  dish: string
  description: string
}

export interface ShoppingItem {
  ingredient: string
  quantity: string
  category: string
}

export interface TimelineStep {
  time: string
  task: string
}

export interface Player {
  id: string
  nickname: string
  role?: PlayerRole
  isHost: boolean
  restaurantPick?: Restaurant
}

export type PlayerRole = 'decider' | 'high-risk' | 'low-risk'

export interface Room {
  code: string
  players: Player[]
  phase: RoomPhase
  ritual?: RitualType
  results?: RitualResult
  duel?: DuelState
}

export type RoomPhase =
  | 'lobby'
  | 'role-assignment'
  | 'ritual-select'
  | 'ritual-active'
  | 'duel-pick'
  | 'duel-active'
  | 'results'

export type RitualType =
  | 'last-one-standing'
  | 'wheel-of-fate'
  | 'instant-draw'
  | 'creative'

export interface RitualResult {
  winnerId: string
  loserId: string
  paymentSplit: PaymentSplit
  ritualName: string
}

export type PaymentSplit = '100/0' | '75/25' | '60/40' | '50/50'

export interface DuelState {
  player1Id: string
  player2Id: string
  player1Pick?: Restaurant
  player2Pick?: Restaurant
  winnerId?: string
}

export interface FateHistory {
  date: string
  role: PlayerRole | 'winner' | 'loser'
  paymentSplit: PaymentSplit
  restaurant?: string
  ritualName: string
}

export interface Streaks {
  escapeStreak: number
  lossStreak: number
  bestEscapeStreak: number
  worstLossStreak: number
}

export type AppMode = 'solo' | 'group'
export type TabId = 'decide' | 'luck' | 'fine-dining' | 'play' | 'order'
