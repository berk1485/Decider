import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRoomContext } from '../../context/RoomContext'
import { shuffle, randomPaymentSplit } from '../../lib/utils'

export default function LastOneStanding() {
  const { room, isHost, setResults } = useRoomContext()
  const [remaining, setRemaining] = useState<string[]>([])
  const [eliminated, setEliminated] = useState<string[]>([])
  const [phase, setPhase] = useState<'running' | 'done'>('running')

  useEffect(() => {
    if (!room) return
    const ids = shuffle(room.players.map(p => p.id))
    setRemaining(ids)

    let step = 0
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev.length <= 2) {
          clearInterval(interval)
          return prev
        }
        const victim = prev[prev.length - 1]!
        setEliminated(e => [...e, victim])
        return prev.slice(0, -1)
      })
      step++
    }, 1200)

    return () => clearInterval(interval)
  }, [room])

  useEffect(() => {
    if (remaining.length === 2 && phase === 'running') {
      setPhase('done')
      if (isHost) {
        const winnerId = remaining[0]!
        const loserId = remaining[1]!
        setTimeout(() => {
          setResults({
            winnerId,
            loserId,
            paymentSplit: randomPaymentSplit(),
            ritualName: 'Last One Standing',
          })
        }, 2000)
      }
    }
  }, [remaining, phase, isHost, setResults])

  const getName = (id: string) => room?.players.find(p => p.id === id)?.nickname ?? 'Unknown'

  return (
    <div className="py-8">
      <h3 className="text-center text-sm text-muted uppercase tracking-wider mb-6">Last One Standing</h3>

      <div className="space-y-2">
        <AnimatePresence>
          {remaining.map(id => (
            <motion.div
              key={id}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter border border-zinc-800"
              exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm text-primary font-medium">{getName(id)}</span>
              <span className="text-xs text-success">Still standing</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {eliminated.map(id => (
          <motion.div
            key={`elim-${id}`}
            className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter border border-danger/20 opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
          >
            <span className="text-sm text-muted line-through">{getName(id)}</span>
            <span className="text-xs text-danger">Eliminated</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
