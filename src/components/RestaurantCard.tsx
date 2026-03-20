import { Star, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Restaurant } from '../types'

interface Props {
  restaurant: Restaurant
  dish?: string
  onSelect?: (restaurant: Restaurant) => void
}

export default function RestaurantCard({ restaurant, dish, onSelect }: Props) {
  return (
    <motion.button
      onClick={() => onSelect?.(restaurant)}
      className="w-full text-left p-4 rounded-xl bg-surface-lighter border border-zinc-800 transition-colors active:bg-surface-light"
      whileTap={{ scale: 0.98 }}
    >
      {dish && (
        <p className="text-base font-semibold text-primary mb-1">{dish}</p>
      )}
      <p className={`${dish ? 'text-sm text-muted' : 'text-base font-semibold text-primary'}`}>
        {restaurant.name}
      </p>
      <div className="flex items-center gap-3 mt-2 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-warning fill-warning" />
          {restaurant.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {restaurant.distance}
        </span>
        {restaurant.priceLevel !== undefined && (
          <span>{'$'.repeat(restaurant.priceLevel)}</span>
        )}
      </div>
    </motion.button>
  )
}
