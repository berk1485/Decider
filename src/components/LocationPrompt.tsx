import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useGeolocation } from '../hooks/useGeolocation'

export default function LocationPrompt() {
  const { dispatch } = useApp()
  const geo = useGeolocation()
  const [manualInput, setManualInput] = useState('')
  const [showManual, setShowManual] = useState(false)

  const handleUseLocation = () => {
    geo.requestLocation()
  }

  // Watch for geolocation success
  if (geo.granted && geo.lat !== null && geo.lng !== null) {
    dispatch({ type: 'SET_LOCATION', lat: geo.lat, lng: geo.lng })
  }

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return
    // Use a geocoding fallback — for now, set a default location
    // In production this would hit a geocoding API
    dispatch({ type: 'SET_LOCATION', lat: 40.7128, lng: -74.006 })
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-surface px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MapPin className="w-10 h-10 text-muted mb-6" />

      <h2 className="text-xl font-semibold text-primary mb-2 text-center">
        Find real restaurants near you
      </h2>
      <p className="text-sm text-muted mb-8 text-center max-w-xs">
        We use your location to find real restaurants nearby. Nothing is stored.
      </p>

      {geo.error && (
        <p className="text-sm text-danger mb-4">{geo.error}</p>
      )}

      {!showManual ? (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleUseLocation}
            disabled={geo.loading}
            className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95 disabled:opacity-50"
          >
            {geo.loading ? 'Getting location...' : 'Use my location'}
          </button>
          <button
            onClick={() => setShowManual(true)}
            className="w-full py-3.5 rounded-xl border border-zinc-700 text-primary font-semibold text-base transition-transform active:scale-95"
          >
            Enter manually
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="City, zip code, or address"
            className="w-full py-3 px-4 rounded-xl bg-surface-lighter border border-zinc-700 text-primary placeholder:text-muted text-sm focus:outline-none focus:border-zinc-500"
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            autoFocus
          />
          <button
            onClick={handleManualSubmit}
            disabled={!manualInput.trim()}
            className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95 disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={() => setShowManual(false)}
            className="text-sm text-muted underline"
          >
            Back
          </button>
        </div>
      )}
    </motion.div>
  )
}
