import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRoomContext } from '../../context/RoomContext'
import { useAI } from '../../hooks/useAI'
import { pickRandom, randomPaymentSplit } from '../../lib/utils'
import RitualAnimation from '../../components/RitualAnimation'

interface CreativeRitual {
  name: string
  description: string
  suspenseText: string
}

const FALLBACK_RITUALS: CreativeRitual[] = [
  {
    name: 'The Coin of Dread',
    description: 'An invisible coin flips in the void. Heads or tails — but you never see which side it lands on.',
    suspenseText: 'The coin is spinning...',
  },
  {
    name: 'Blink Roulette',
    description: 'Everyone blinks. The last person the universe noticed loses.',
    suspenseText: 'The universe is watching...',
  },
  {
    name: 'The Silent Auction',
    description: 'Fate silently chooses a number. Whoever\'s existence resonates closest to it... pays.',
    suspenseText: 'Fate is calculating...',
  },
  {
    name: 'Quantum Dinner',
    description: 'Until observed, everyone is simultaneously paying and not paying. Then the wavefunction collapses.',
    suspenseText: 'Wavefunction collapsing...',
  },
]

export default function CreativeRituals() {
  const { room, isHost, setResults } = useRoomContext()
  const { askStructured } = useAI()
  const [ritual, setRitual] = useState<CreativeRitual | null>(null)
  const [phase, setPhase] = useState<'generating' | 'describe' | 'running' | 'done'>('generating')

  useEffect(() => {
    let cancelled = false

    async function generate() {
      try {
        const result = await askStructured<CreativeRitual[]>(
          'Generate 2 unique, creative luck-based dinner payment rituals. Each must be purely random (no skill), take under 10 seconds, and feel slightly weird/memorable. Focus on tension and surprise.',
          `Return a JSON array of objects with: name (string, creative name), description (string, 1-2 sentences explaining the ritual), suspenseText (string, what to show during the suspense moment).`,
        )
        if (!cancelled && result && result.length > 0) {
          setRitual(pickRandom(result))
        } else {
          setRitual(pickRandom(FALLBACK_RITUALS))
        }
      } catch {
        if (!cancelled) setRitual(pickRandom(FALLBACK_RITUALS))
      }
      if (!cancelled) setPhase('describe')
    }

    generate()
    return () => { cancelled = true }
  }, [askStructured])

  useEffect(() => {
    if (phase !== 'describe') return
    const timer = setTimeout(() => setPhase('running'), 3000)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'running' || !room || !isHost) return
    const timer = setTimeout(() => {
      const loser = pickRandom(room.players)
      const winner = room.players.find(p => p.id !== loser.id) ?? room.players[0]!
      setResults({
        winnerId: winner.id,
        loserId: loser.id,
        paymentSplit: randomPaymentSplit(),
        ritualName: ritual?.name ?? 'Mystery Ritual',
      })
      setPhase('done')
    }, 4000)
    return () => clearTimeout(timer)
  }, [phase, room, isHost, setResults, ritual])

  return (
    <div className="py-8">
      <AnimatePresence mode="wait">
        {phase === 'generating' && (
          <motion.div key="gen" exit={{ opacity: 0 }}>
            <RitualAnimation text="Conjuring ritual..." subtext="The universe is getting creative" />
          </motion.div>
        )}

        {phase === 'describe' && ritual && (
          <motion.div
            key="desc"
            className="text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-primary mb-3">{ritual.name}</h3>
            <p className="text-sm text-muted leading-relaxed">{ritual.description}</p>
          </motion.div>
        )}

        {phase === 'running' && ritual && (
          <motion.div key="run" exit={{ opacity: 0 }}>
            <RitualAnimation
              text={ritual.suspenseText}
              subtext="Hold your breath..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
