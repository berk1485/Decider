import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  loading: boolean
  children: React.ReactNode
  duration?: number
}

export default function SuspenseReveal({ loading, children, duration = 1500 }: Props) {
  const [showResult, setShowResult] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (loading) {
      setShowResult(false)
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.')
      }, 400)
      return () => clearInterval(interval)
    } else {
      const timer = setTimeout(() => setShowResult(true), duration)
      return () => clearTimeout(timer)
    }
  }, [loading, duration])

  return (
    <AnimatePresence mode="wait">
      {loading || !showResult ? (
        <motion.div
          key="suspense"
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-zinc-700 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="mt-4 text-muted text-sm">
            {loading ? `Finding your fate${dots}` : `Revealing${dots}`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
