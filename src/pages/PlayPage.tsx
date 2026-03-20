import { Gamepad2 } from 'lucide-react'
import { RoomProvider, useRoomContext } from '../context/RoomContext'
import { useHistory } from '../hooks/useHistory'
import RoomLobby from '../play/RoomLobby'
import RoomView from '../play/RoomView'

function PlayContent() {
  const { room } = useRoomContext()
  const { lastResult, streaks, paidCount, escapedCount } = useHistory()

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Gamepad2 className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-primary">Play</h1>
      </div>

      {/* Session memory */}
      {lastResult && !room && (
        <div className="p-3 rounded-xl bg-surface-lighter border border-zinc-800 mb-4">
          <p className="text-xs text-muted">Last time: <span className="text-primary">{lastResult}</span></p>
        </div>
      )}

      {/* Streaks */}
      {!room && (paidCount > 0 || escapedCount > 0) && (
        <div className="flex gap-3 mb-4">
          {paidCount > 0 && (
            <div className="flex-1 p-3 rounded-xl bg-surface-lighter border border-zinc-800 text-center">
              <p className="text-lg font-bold text-danger">{paidCount}</p>
              <p className="text-xs text-muted">times paid</p>
            </div>
          )}
          {escapedCount > 0 && (
            <div className="flex-1 p-3 rounded-xl bg-surface-lighter border border-zinc-800 text-center">
              <p className="text-lg font-bold text-success">{escapedCount}</p>
              <p className="text-xs text-muted">escapes</p>
            </div>
          )}
          {streaks.escapeStreak > 1 && (
            <div className="flex-1 p-3 rounded-xl bg-surface-lighter border border-success/20 text-center">
              <p className="text-lg font-bold text-success">{streaks.escapeStreak}</p>
              <p className="text-xs text-muted">streak</p>
            </div>
          )}
          {streaks.lossStreak > 1 && (
            <div className="flex-1 p-3 rounded-xl bg-surface-lighter border border-danger/20 text-center">
              <p className="text-lg font-bold text-danger">{streaks.lossStreak}</p>
              <p className="text-xs text-muted">loss streak</p>
            </div>
          )}
        </div>
      )}

      {room ? <RoomView /> : <RoomLobby />}
    </div>
  )
}

export default function PlayPage() {
  return (
    <RoomProvider>
      <PlayContent />
    </RoomProvider>
  )
}
