import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRoomContext } from '../../context/RoomContext'
import { pickRandom, randomPaymentSplit } from '../../lib/utils'

export default function InstantDraw() {
  const { room, isHost, setResults } = useRoomContext()
  const [phase, setPhase] = useState<'countdown' | 'reveal'>('countdown')
  const [count, setCount] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(timer)
          setPhase('reveal')
          return 0
        }
        return c - 1
      })
    }, 800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (phase !== 'reveal' || !room || !isHost) return
    const loser = pickRandom(room.players)
    const winner = room.players.find(p => p.id !== loser.id) ?? room.players[0]!
    setTimeout(() => {
      setResults({
        winnerId: winner.id,
        loserId: loser.id,
        paymentSplit: randomPaymentSplit(),
        ritualName: 'Instant Draw',
      })
    }, 2000)
  }, [phase, room, isHost, setResults])

  return (
    <div className="py-8">
      <h3 className="text-center text-sm text-muted uppercase tracking-wider mb-6">Instant Draw</h3>

      <AnimatePresence mode="wait">
        {phase === 'countdown' ? (
          <motion.div
            key="countdown"
            className="flex items-center justify-center py-16"
            exit={{ opacity: 0 }}
          >
            <motion.span
              key={count}
              className="text-7xl font-bold text-primary"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {count}
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            className="text-center py-16"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <p className="text-4xl font-bold text-primary mb-2">DRAW!</p>
            <p className="text-sm text-muted">Calculating result...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
