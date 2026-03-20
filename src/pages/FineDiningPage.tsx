import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, Loader2, ShoppingCart, Clock, Palette } from 'lucide-react'
import { useAI } from '../hooks/useAI'
import type { MealPlan } from '../types'

export default function FineDiningPage() {
  const { askStructured, loading } = useAI()
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [guests, setGuests] = useState('2')
  const [occasion, setOccasion] = useState('Date night')
  const [error, setError] = useState<string | null>(null)

  const occasions = ['Date night', 'Dinner party', 'Celebration', 'Solo treat']

  const handleGenerate = async () => {
    setError(null)
    const result = await askStructured<MealPlan>(
      `Plan a fine dining multi-course meal for ${guests} guests. Occasion: ${occasion}. Include 4-5 courses.`,
      `You are an expert chef and meal planner. Return JSON with:
- title: string (creative name for the meal)
- courses: array of { name: string (e.g. "Amuse-bouche"), dish: string, description: string }
- shoppingList: array of { ingredient: string, quantity: string, category: string (produce/protein/dairy/pantry/other) }
- timeline: array of { time: string (e.g. "3 hours before"), task: string }
- platingNotes: string[] (3-4 tips for presentation)`,
    )

    if (result) {
      setPlan(result)
    } else {
      setError('Failed to generate meal plan. Try again.')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <ChefHat className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-primary">Fine Dining</h1>
      </div>

      {!plan ? (
        <div className="space-y-5">
          <p className="text-sm text-muted">
            AI-crafted multi-course meal with shopping list, timeline, and plating notes.
          </p>

          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Guests</p>
            <div className="flex gap-2">
              {['1', '2', '4', '6', '8'].map(n => (
                <button
                  key={n}
                  onClick={() => setGuests(n)}
                  className={`px-4 py-1.5 rounded-lg text-sm ${
                    guests === n ? 'bg-primary text-surface font-medium' : 'bg-surface-lighter text-muted border border-zinc-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Occasion</p>
            <div className="flex flex-wrap gap-2">
              {occasions.map(o => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    occasion === o ? 'bg-primary text-surface font-medium' : 'bg-surface-lighter text-muted border border-zinc-800'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Crafting your menu...</>
            ) : (
              'Generate Meal Plan'
            )}
          </button>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <h2 className="text-lg font-bold text-primary">{plan.title}</h2>
            <p className="text-xs text-muted">{guests} guests · {occasion}</p>
          </div>

          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-3">Courses</p>
            <div className="space-y-3">
              {plan.courses.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-lighter border border-zinc-800">
                  <p className="text-xs text-muted">{c.name}</p>
                  <p className="text-base font-semibold text-primary">{c.dish}</p>
                  <p className="text-sm text-muted mt-1">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-muted" />
              <p className="text-xs text-muted uppercase tracking-wider">Shopping List</p>
            </div>
            <div className="space-y-1">
              {plan.shoppingList.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-zinc-800/50">
                  <span className="text-primary">{item.ingredient}</span>
                  <span className="text-muted">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted" />
              <p className="text-xs text-muted uppercase tracking-wider">Timeline</p>
            </div>
            <div className="space-y-2">
              {plan.timeline.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-muted whitespace-nowrap min-w-[100px]">{step.time}</span>
                  <span className="text-primary">{step.task}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-muted" />
              <p className="text-xs text-muted uppercase tracking-wider">Plating Notes</p>
            </div>
            <ul className="space-y-1">
              {plan.platingNotes.map((note, i) => (
                <li key={i} className="text-sm text-muted flex gap-2">
                  <span className="text-primary">·</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setPlan(null)}
            className="w-full py-3 rounded-xl border border-zinc-700 text-muted text-sm"
          >
            Generate another
          </button>
        </motion.div>
      )}
    </div>
  )
}
