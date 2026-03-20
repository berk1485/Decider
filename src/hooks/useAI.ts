import { useState, useCallback } from 'react'
import { fetchAI, fetchAIStructured } from '../lib/api'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ask = useCallback(async (prompt: string, systemPrompt?: string): Promise<string | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchAI(prompt, systemPrompt)
      return response
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI request failed'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const askStructured = useCallback(async <T>(prompt: string, systemPrompt: string): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchAIStructured<T>(prompt, systemPrompt)
      return response
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI request failed'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, ask, askStructured }
}
