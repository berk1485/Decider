import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useRestaurants } from '../hooks/useRestaurants'
import { useAI } from '../hooks/useAI'
import RestaurantCard from '../components/RestaurantCard'
import type { Restaurant, DishSuggestion } from '../types'

const DIETARY = ['Any', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free']
const BUDGET = ['$', '$$', '$$$', '$$$$']
const DISTANCE = ['0.5 km', '1 km', '2 km', '5 km']
const MOODS = ['Comfort food', 'Something new', 'Quick bite', 'Date night', 'Healthy', 'Late night']

export default function DecidePage() {
  const { state, dispatch } = useApp()
  const { search, loading: placesLoading } = useRestaurants()
  const { askStructured, loading: aiLoading } = useAI()

  const [dietary, setDietary] = useState('Any')
  const [budget, setBudget] = useState('$$')
  const [distance, setDistance] = useState('2 km')
  const [mood, setMood] = useState('Comfort food')
  const [results, setResults] = useState<(DishSuggestion & { restaurant: Restaurant })[]>([])
  const [error, setError] = useState<string | null>(null)

  const loading = placesLoading || aiLoading

  const handleDecide = async () => {
    if (!state.location) return
    setError(null)
    setResults([])

    const radiusMap: Record<string, number> = { '0.5 km': 500, '1 km': 1000, '2 km': 2000, '5 km': 5000 }
    const radius = radiusMap[distance] ?? 2000

    try {
      const restaurants = await search(state.location.lat, state.location.lng, radius)
      if (!restaurants.length) {
        setError('No restaurants found nearby. Try increasing distance.')
        return
      }

      const restaurantList = restaurants.slice(0, 10).map(r => `- ${r.name} (${r.rating}★, ${r.distance})`).join('\n')

      const suggestions = await askStructured<DishSuggestion[]>(
        `I'm looking for ${mood.toLowerCase()} food. Dietary: ${dietary}. Budget: ${budget}. Here are nearby restaurants:\n${restaurantList}\n\nSuggest 3-5 specific dishes I should order, each matched to one of these restaurants.`,
        `You are a food recommendation AI. Return a JSON array of objects with: dish (string), cuisine (string), description (string, 1 sentence), restaurantName (string, must match one from the list exactly).`,
      )

      if (!suggestions || !suggestions.length) {
        setError('Could not generate suggestions. Try again.')
        return
      }

      const matched = suggestions.map(s => {
        const r = restaurants.find(
          r => r.name.toLowerCase() === ((s as DishSuggestion & { restaurantName?: string }).restaurantName ?? '').toLowerCase()
        ) ?? restaurants[0]!
        return { ...s, restaurant: r }
      }).slice(0, 5)

      setResults(matched)
    } catch {
      setError('Something went wrong. Check your connection and try again.')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-primary">Decide</h1>
      </div>

      {!results.length && (
        <div className="space-y-5">
          <Section label="Dietary">
            <ChipGroup options={DIETARY} selected={dietary} onSelect={setDietary} />
          </Section>
          <Section label="Budget">
            <ChipGroup options={BUDGET} selected={budget} onSelect={setBudget} />
          </Section>
          <Section label="Distance">
            <ChipGroup options={DISTANCE} selected={distance} onSelect={setDistance} />
          </Section>
          <Section label="Mood">
            <ChipGroup options={MOODS} selected={mood} onSelect={setMood} />
          </Section>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={handleDecide}
            disabled={loading || !state.location}
            className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Deciding...</>
            ) : (
              'Decide for me'
            )}
          </button>

          {!state.location && (
            <p className="text-xs text-muted text-center">Location required to find restaurants</p>
          )}
        </div>
      )}

      {results.length > 0 && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-muted mb-2">Your fate has been decided:</p>
          {results.map((r, i) => (
            <RestaurantCard
              key={i}
              restaurant={r.restaurant}
              dish={r.dish}
              onSelect={(restaurant) => {
                dispatch({ type: 'SELECT_RESTAURANT', restaurant })
                dispatch({ type: 'SET_TAB', tab: 'order' })
              }}
            />
          ))}
          <button
            onClick={() => setResults([])}
            className="w-full py-3 rounded-xl border border-zinc-700 text-muted text-sm mt-4"
          >
            Decide again
          </button>
        </motion.div>
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  )
}

function ChipGroup({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selected === opt
              ? 'bg-primary text-surface font-medium'
              : 'bg-surface-lighter text-muted border border-zinc-800'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
