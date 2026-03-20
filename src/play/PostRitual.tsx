import { motion } from 'framer-motion'
import { useRoomContext } from '../context/RoomContext'
import { useHistory } from '../hooks/useHistory'
import PaymentSplitDisplay from '../components/PaymentSplit'

export default function PostRitual() {
  const { room, playerId, isHost, setPhase } = useRoomContext()
  const { addResult, lastResult } = useHistory()

  if (!room?.results) return null

  const { winnerId, loserId, paymentSplit, ritualName } = room.results
  const winner = room.players.find(p => p.id === winnerId)
  const loser = room.players.find(p => p.id === loserId)
  const isWinner = playerId === winnerId
  const isLoser = playerId === loserId

  const handleAccept = () => {
    addResult({
      date: new Date().toISOString(),
      role: isWinner ? 'winner' : 'loser',
      paymentSplit,
      ritualName,
      restaurant: room.duel?.player1Pick?.name ?? room.duel?.player2Pick?.name,
    })
  }

  const handleDoubleOrNothing = () => {
    setPhase('lobby')
  }

  return (
    <motion.div
      className="py-8 space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-center">
        <motion.p
          className="text-3xl font-bold mb-2"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          {isWinner ? '🎉' : isLoser ? '💀' : '👀'}
        </motion.p>
        <p className={`text-xl font-bold ${isWinner ? 'text-success' : isLoser ? 'text-danger' : 'text-primary'}`}>
          {isWinner ? 'You escaped!' : isLoser ? 'You lost.' : 'Fate has decided.'}
        </p>
        <p className="text-sm text-muted mt-1">
          {ritualName}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter border border-success/30">
          <span className="text-sm text-primary">{winner?.nickname ?? 'Winner'}</span>
          <span className="text-xs text-success font-medium">Winner</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter border border-danger/30">
          <span className="text-sm text-primary">{loser?.nickname ?? 'Loser'}</span>
          <span className="text-xs text-danger font-medium">Pays</span>
        </div>
      </div>

      <PaymentSplitDisplay
        split={paymentSplit}
        winnerName={winner?.nickname ?? 'Winner'}
        loserName={loser?.nickname ?? 'Loser'}
      />

      {lastResult && (
        <p className="text-xs text-muted text-center">
          Last time: {lastResult}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={handleAccept}
          className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95"
        >
          Accept Outcome
        </button>
        {isHost && (
          <button
            onClick={handleDoubleOrNothing}
            className="w-full py-3.5 rounded-xl border border-danger text-danger font-semibold text-base transition-transform active:scale-95"
          >
            Double or Nothing
          </button>
        )}
      </div>
    </motion.div>
  )
}
