import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppMode, TabId, Restaurant } from '../types'

interface AppState {
  mode: AppMode | null
  tab: TabId
  location: { lat: number; lng: number } | null
  locationGranted: boolean
  showEntry: boolean
  showLocationPrompt: boolean
  selectedRestaurant: Restaurant | null
  paymentOwed: number | null
}

type AppAction =
  | { type: 'SET_MODE'; mode: AppMode }
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'SET_LOCATION'; lat: number; lng: number }
  | { type: 'DISMISS_ENTRY' }
  | { type: 'SHOW_LOCATION_PROMPT' }
  | { type: 'DISMISS_LOCATION_PROMPT' }
  | { type: 'SELECT_RESTAURANT'; restaurant: Restaurant }
  | { type: 'SET_PAYMENT'; amount: number }
  | { type: 'CLEAR_PAYMENT' }

const initialState: AppState = {
  mode: null,
  tab: 'decide',
  location: null,
  locationGranted: false,
  showEntry: true,
  showLocationPrompt: false,
  selectedRestaurant: null,
  paymentOwed: null,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode, showEntry: false, showLocationPrompt: true }
    case 'SET_TAB':
      return { ...state, tab: action.tab }
    case 'SET_LOCATION':
      return { ...state, location: { lat: action.lat, lng: action.lng }, locationGranted: true, showLocationPrompt: false }
    case 'DISMISS_ENTRY':
      return { ...state, showEntry: false }
    case 'SHOW_LOCATION_PROMPT':
      return { ...state, showLocationPrompt: true }
    case 'DISMISS_LOCATION_PROMPT':
      return { ...state, showLocationPrompt: false }
    case 'SELECT_RESTAURANT':
      return { ...state, selectedRestaurant: action.restaurant }
    case 'SET_PAYMENT':
      return { ...state, paymentOwed: action.amount }
    case 'CLEAR_PAYMENT':
      return { ...state, paymentOwed: null }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
