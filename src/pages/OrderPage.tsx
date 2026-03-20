import { Star, MapPin, Navigation, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function OrderPage() {
  const { state, dispatch } = useApp()
  const restaurant = state.selectedRestaurant

  if (!restaurant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-muted text-sm mb-2">No restaurant selected yet.</p>
        <p className="text-xs text-muted">Use Decide or Luck to pick one.</p>
      </div>
    )
  }

  const encodedName = encodeURIComponent(restaurant.name)
  const encodedAddr = encodeURIComponent(restaurant.address)
  const mapsUrl = `https://maps.google.com/?q=${encodedName}+${encodedAddr}`
  const uberEatsUrl = `https://www.ubereats.com/search?q=${encodedName}`
  const doorDashUrl = `https://www.doordash.com/search/store/${encodedName}`

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6">
      <h1 className="text-xl font-bold text-primary mb-6">Order</h1>

      <motion.div
        className="p-5 rounded-xl bg-surface-lighter border border-zinc-800 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-bold text-primary mb-1">{restaurant.name}</h2>
        <div className="flex items-center gap-3 text-sm text-muted mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            {restaurant.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {restaurant.distance}
          </span>
        </div>
        <p className="text-sm text-muted">{restaurant.address}</p>
      </motion.div>

      <div className="space-y-3 mb-8">
        <OrderLink href={uberEatsUrl} label="Open in Uber Eats" />
        <OrderLink href={doorDashUrl} label="Open in DoorDash" />
        <OrderLink href={mapsUrl} label="Open in Google Maps" icon={<Navigation className="w-4 h-4" />} />
      </div>

      {state.paymentOwed !== null && (
        <motion.div
          className="p-5 rounded-xl bg-surface-lighter border border-danger/30 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-muted mb-1">You owe</p>
          <p className="text-3xl font-bold text-danger">${state.paymentOwed.toFixed(2)}</p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://cash.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-surface text-primary text-sm font-medium text-center border border-zinc-700"
            >
              Apple Cash
            </a>
            <button
              onClick={() => dispatch({ type: 'CLEAR_PAYMENT' })}
              className="flex-1 py-2.5 rounded-xl bg-surface text-muted text-sm text-center border border-zinc-800"
            >
              Mark Paid
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function OrderLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full p-4 rounded-xl bg-surface-lighter border border-zinc-800 text-primary transition-colors active:bg-surface-light"
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        {icon ?? <ExternalLink className="w-4 h-4" />}
        {label}
      </span>
      <ExternalLink className="w-4 h-4 text-muted" />
    </a>
  )
}
