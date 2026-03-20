import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRoomContext } from '../context/RoomContext'
import { shuffle } from '../lib/utils'
import type { PlayerRole } from '../types'

const ROLES: PlayerRole[] = ['decider', 'high-risk', 'low-risk']
const ROLE_LABELS: Record<PlayerRole, string> = {
  'decider': 'The Decider',
  'high-risk': 'High Risk',
  'low-risk': 'Low Risk',
}
const ROLE_COLORS: Record<PlayerRole, string> = {
  'decider': 'text-warning',
  'high-risk': 'text-danger',
  'low-risk': 'text-success',
}

export default function RoleAssignment() {
  const { room, playerId } = useRoomContext()
  const [assignments, setAssignments] = useState<Map<string, PlayerRole>>(new Map())
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!room) return
    const shuffled = shuffle(room.players)
    const map = new Map<string, PlayerRole>()
    shuffled.forEach((p, i) => {
      map.set(p.id, ROLES[i % ROLES.length]!)
    })
    setAssignments(map)

    const timer = setTimeout(() => setRevealed(true), 1500)
    return () => clearTimeout(timer)
  }, [room])

  const myRole = assignments.get(playerId)

  return (
    <div className="py-8">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="assigning"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 mx-auto rounded-full border-2 border-zinc-700 border-t-warning"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="mt-4 text-sm text-muted">Assigning roles...</p>
          </motion.div>
        ) : (
          <motion.div
            key="roles"
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {myRole && (
              <div className="text-center mb-6">
                <p className="text-xs text-muted uppercase tracking-wider">Your role</p>
                <p className={`text-2xl font-bold ${ROLE_COLORS[myRole]}`}>
                  {ROLE_LABELS[myRole]}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {room?.players.map(p => {
                const role = assignments.get(p.id)
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter border border-zinc-800"
                  >
                    <span className="text-sm text-primary">{p.nickname}</span>
                    {role && (
                      <span className={`text-xs font-medium ${ROLE_COLORS[role]}`}>
                        {ROLE_LABELS[role]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
