import { useState } from 'react'
import { Clover } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useRestaurants } from '../hooks/useRestaurants'
import { pickRandom } from '../lib/utils'
import RestaurantCard from '../components/RestaurantCard'
import SuspenseReveal from '../components/SuspenseReveal'
import type { Restaurant } from '../types'

export default function LuckPage() {
  const { state, dispatch } = useApp()
  const { search } = useRestaurants()
  const [result, setResult] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLuck = async () => {
    if (!state.location) return
    setError(null)
    setResult(null)
    setLoading(true)
    setRevealing(true)

    try {
      const restaurants = await search(state.location.lat, state.location.lng, 3000)
      if (!restaurants.length) {
        setError('No restaurants found nearby.')
        setRevealing(false)
        return
      }
      setResult(pickRandom(restaurants))
    } catch {
      setError('Failed to find restaurants. Try again.')
      setRevealing(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      {!revealing ? (
        <div className="flex flex-col items-center">
          <Clover className="w-12 h-12 text-muted mb-6" />
          <h1 className="text-2xl font-bold text-primary mb-2">Feeling Lucky?</h1>
          <p className="text-sm text-muted mb-8 text-center">
            One restaurant. No thinking. Pure fate.
          </p>

          {error && <p className="text-sm text-danger mb-4">{error}</p>}

          <button
            onClick={handleLuck}
            disabled={!state.location}
            className="px-8 py-4 rounded-2xl bg-primary text-surface font-bold text-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            I'm Feeling Lucky
          </button>

          {!state.location && (
            <p className="text-xs text-muted mt-4">Location required</p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <SuspenseReveal loading={loading}>
            {result && (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted">Fate has chosen:</p>
                <RestaurantCard
                  restaurant={result}
                  onSelect={(restaurant) => {
                    dispatch({ type: 'SELECT_RESTAURANT', restaurant })
                    dispatch({ type: 'SET_TAB', tab: 'order' })
                  }}
                />
                <button
                  onClick={() => { setRevealing(false); setResult(null) }}
                  className="w-full py-3 rounded-xl border border-zinc-700 text-muted text-sm"
                >
                  Try again
                </button>
              </div>
            )}
          </SuspenseReveal>
        </div>
      )}
    </div>
  )
}
