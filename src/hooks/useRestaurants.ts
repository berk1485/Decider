import { useState, useCallback, useRef } from 'react'
import type { Restaurant } from '../types'
import { fetchNearbyRestaurants } from '../lib/api'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cache = useRef<Map<string, Restaurant[]>>(new Map())

  const search = useCallback(async (
    lat: number,
    lng: number,
    radius?: number,
    types?: string[],
  ) => {
    const key = `${lat},${lng},${radius ?? 2000},${types?.join(',') ?? ''}`
    const cached = cache.current.get(key)
    if (cached) {
      setRestaurants(cached)
      return cached
    }

    setLoading(true)
    setError(null)
    try {
      const results = await fetchNearbyRestaurants(lat, lng, radius, types)
      cache.current.set(key, results)
      setRestaurants(results)
      return results
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch restaurants'
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return { restaurants, loading, error, search }
}
