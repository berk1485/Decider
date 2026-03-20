import { useState, useCallback, useEffect } from 'react'
import type { FateHistory, Streaks } from '../types'

const HISTORY_KEY = 'decider_history'
const STREAKS_KEY = 'decider_streaks'
const LAST_RESULT_KEY = 'decider_last_result'

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useHistory() {
  const [history, setHistory] = useState<FateHistory[]>(() => loadJSON(HISTORY_KEY, []))
  const [streaks, setStreaks] = useState<Streaks>(() => loadJSON(STREAKS_KEY, {
    escapeStreak: 0,
    lossStreak: 0,
    bestEscapeStreak: 0,
    worstLossStreak: 0,
  }))
  const [lastResult, setLastResult] = useState<string | null>(() => localStorage.getItem(LAST_RESULT_KEY))

  useEffect(() => { saveJSON(HISTORY_KEY, history) }, [history])
  useEffect(() => { saveJSON(STREAKS_KEY, streaks) }, [streaks])
  useEffect(() => {
    if (lastResult) localStorage.setItem(LAST_RESULT_KEY, lastResult)
  }, [lastResult])

  const addResult = useCallback((entry: FateHistory) => {
    setHistory(h => [entry, ...h].slice(0, 100))

    const isWin = entry.role === 'winner'
    setStreaks(s => {
      const newStreaks = { ...s }
      if (isWin) {
        newStreaks.escapeStreak = s.escapeStreak + 1
        newStreaks.lossStreak = 0
        newStreaks.bestEscapeStreak = Math.max(s.bestEscapeStreak, newStreaks.escapeStreak)
      } else {
        newStreaks.lossStreak = s.lossStreak + 1
        newStreaks.escapeStreak = 0
        newStreaks.worstLossStreak = Math.max(s.worstLossStreak, newStreaks.lossStreak)
      }
      return newStreaks
    })

    setLastResult(isWin ? 'You escaped!' : 'You lost.')
  }, [])

  const paidCount = history.filter(h => h.role === 'loser').length
  const escapedCount = history.filter(h => h.role === 'winner').length

  return { history, streaks, lastResult, addResult, paidCount, escapedCount }
}
