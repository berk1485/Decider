import { Sparkles, Clover, ChefHat, Gamepad2, ShoppingBag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { TabId } from '../types'

const tabs: { id: TabId; label: string; Icon: typeof Sparkles }[] = [
  { id: 'decide', label: 'Decide', Icon: Sparkles },
  { id: 'luck', label: 'Luck', Icon: Clover },
  { id: 'fine-dining', label: 'Fine Dining', Icon: ChefHat },
  { id: 'play', label: 'Play', Icon: Gamepad2 },
  { id: 'order', label: 'Order', Icon: ShoppingBag },
]

export default function BottomNav() {
  const { state, dispatch } = useApp()

  return (
    <nav className="flex-shrink-0 bg-surface-light border-t border-zinc-800 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {tabs.map(({ id, label, Icon }) => {
          const active = state.tab === id
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_TAB', tab: id })}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 transition-colors ${
                active ? 'text-primary' : 'text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
