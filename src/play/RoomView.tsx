import { motion } from 'framer-motion'
import { Users, Swords, Dices } from 'lucide-react'
import { useRoomContext } from '../context/RoomContext'
import RoleAssignment from './RoleAssignment'
import OutcomeRitual from './OutcomeRitual'
import DuelMode from './DuelMode'
import PostRitual from './PostRitual'
import type { RitualType } from '../types'

const RITUAL_OPTIONS: { type: RitualType; label: string }[] = [
  { type: 'last-one-standing', label: 'Last One Standing' },
  { type: 'wheel-of-fate', label: 'Wheel of Fate' },
  { type: 'instant-draw', label: 'Instant Draw' },
  { type: 'creative', label: 'Mystery Ritual' },
]

export default function RoomView() {
  const { room, playerId, isHost, setPhase, startRitual } = useRoomContext()

  if (!room) return null

  const players = room.players

  return (
    <div className="space-y-4">
      {/* Player list — always visible */}
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-muted" />
        <span className="text-xs text-muted">{players.length} player{players.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {players.map(p => (
          <span
            key={p.id}
            className={`px-3 py-1 rounded-full text-xs ${
              p.id === playerId
                ? 'bg-primary text-surface font-medium'
                : 'bg-surface-lighter text-muted border border-zinc-800'
            }`}
          >
            {p.nickname} {p.isHost ? '(host)' : ''}
          </span>
        ))}
      </div>

      {/* Phase content */}
      {room.phase === 'lobby' && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isHost && players.length >= 2 ? (
            <>
              <p className="text-sm text-muted">Choose your fate:</p>
              <div className="grid grid-cols-2 gap-3">
                {RITUAL_OPTIONS.map(r => (
                  <button
                    key={r.type}
                    onClick={() => {
                      setPhase('role-assignment')
                      setTimeout(() => startRitual(r.type), 3000)
                    }}
                    className="p-4 rounded-xl bg-surface-lighter border border-zinc-800 text-primary text-sm font-medium transition-colors active:bg-surface-light flex flex-col items-center gap-2"
                  >
                    <Dices className="w-5 h-5 text-muted" />
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-3 mt-3">
                <button
                  onClick={() => setPhase('duel-pick')}
                  className="w-full p-4 rounded-xl bg-surface-lighter border border-zinc-800 text-primary text-sm font-medium transition-colors active:bg-surface-light flex items-center justify-center gap-2"
                >
                  <Swords className="w-5 h-5 text-muted" />
                  Duel Mode
                </button>
              </div>
            </>
          ) : isHost ? (
            <p className="text-sm text-muted text-center py-8">
              Waiting for at least 2 players...
            </p>
          ) : (
            <p className="text-sm text-muted text-center py-8">
              Waiting for host to start...
            </p>
          )}
        </motion.div>
      )}

      {room.phase === 'role-assignment' && <RoleAssignment />}
      {room.phase === 'ritual-active' && <OutcomeRitual />}
      {(room.phase === 'duel-pick' || room.phase === 'duel-active') && <DuelMode />}
      {room.phase === 'results' && <PostRitual />}
    </div>
  )
}
