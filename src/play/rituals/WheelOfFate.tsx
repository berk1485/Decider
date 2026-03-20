import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRoomContext } from '../../context/RoomContext'
import { pickRandom, randomPaymentSplit } from '../../lib/utils'

export default function WheelOfFate() {
  const { room, isHost, setResults } = useRoomContext()
  const [spinning, setSpinning] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!room) return
    const players = room.players

    // Rapid cycling through names
    let speed = 80
    let count = 0
    const maxCycles = 20 + Math.floor(Math.random() * 10)

    const cycle = () => {
      setCurrentIdx(i => (i + 1) % players.length)
      count++
      speed += 15 // Slows down gradually
      if (count >= maxCycles) {
        setSpinning(false)
        const loser = pickRandom(players)
        setSelectedId(loser.id)

        if (isHost) {
          const winner = players.find(p => p.id !== loser.id) ?? players[0]!
          setTimeout(() => {
            setResults({
              winnerId: winner.id,
              loserId: loser.id,
              paymentSplit: randomPaymentSplit(),
              ritualName: 'Wheel of Fate',
            })
          }, 2000)
        }
        return
      }
      setTimeout(cycle, speed)
    }

    setTimeout(cycle, speed)
  }, [room, isHost, setResults])

  if (!room) return null

  return (
    <div className="py-8">
      <h3 className="text-center text-sm text-muted uppercase tracking-wider mb-6">Wheel of Fate</h3>

      <motion.div
        className="relative w-48 h-48 mx-auto mb-8"
        animate={spinning ? { rotate: 360 } : {}}
        transition={spinning ? { duration: 0.5, repeat: Infinity, ease: 'linear' } : {}}
      >
        <div className="absolute inset-0 rounded-full border-4 border-zinc-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg font-bold text-primary">
            {room.players[currentIdx]?.nickname ?? '?'}
          </p>
        </div>
      </motion.div>

      <div className="space-y-2">
        {room.players.map(p => (
          <div
            key={p.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
              selectedId === p.id
                ? 'bg-danger/10 border-danger/30'
                : selectedId && selectedId !== p.id
                ? 'bg-success/10 border-success/30'
                : 'bg-surface-lighter border-zinc-800'
            }`}
          >
            <span className="text-sm text-primary">{p.nickname}</span>
            {selectedId === p.id && (
              <span className="text-xs text-danger font-medium">Chosen by fate</span>
            )}
            {selectedId && selectedId !== p.id && (
              <span className="text-xs text-success font-medium">Safe</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
