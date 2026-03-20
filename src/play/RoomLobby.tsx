import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useRoomContext } from '../context/RoomContext'
import { getShareUrl, copyToClipboard } from '../lib/utils'

export default function RoomLobby() {
  const { createRoom, joinRoom, error } = useRoomContext()
  const [nickname, setNickname] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = () => {
    if (!nickname.trim()) return
    const code = createRoom(nickname.trim())
    setCreatedCode(code)
  }

  const handleJoin = () => {
    if (!nickname.trim() || !joinCode.trim()) return
    joinRoom(joinCode.trim(), nickname.trim())
  }

  const handleCopy = async () => {
    if (!createdCode) return
    const ok = await copyToClipboard(getShareUrl(createdCode))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (createdCode) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-sm text-muted mb-2">Room created. Share this code:</p>
        <p className="text-4xl font-mono font-bold text-primary tracking-widest mb-4">{createdCode}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-lighter border border-zinc-700 text-sm text-muted"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy invite link'}
        </button>
        <p className="text-xs text-muted mt-6">Waiting for players to join...</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4 px-4">
      {mode === 'choose' && (
        <motion.div
          className="flex flex-col gap-3 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setMode('create')}
            className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95"
          >
            Create Room
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full py-3.5 rounded-xl border border-zinc-700 text-primary font-semibold text-base transition-transform active:scale-95"
          >
            Join Room
          </button>
        </motion.div>
      )}

      {(mode === 'create' || mode === 'join') && (
        <motion.div
          className="space-y-3 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 20))}
            placeholder="Your nickname"
            className="w-full py-3 px-4 rounded-xl bg-surface-lighter border border-zinc-700 text-primary placeholder:text-muted text-sm focus:outline-none focus:border-zinc-500"
            autoFocus
          />

          {mode === 'join' && (
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="Room code"
              className="w-full py-3 px-4 rounded-xl bg-surface-lighter border border-zinc-700 text-primary placeholder:text-muted text-sm focus:outline-none focus:border-zinc-500 font-mono tracking-widest text-center text-lg"
            />
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={!nickname.trim() || (mode === 'join' && joinCode.length < 4)}
            className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95 disabled:opacity-50"
          >
            {mode === 'create' ? 'Create' : 'Join'}
          </button>

          <button
            onClick={() => setMode('choose')}
            className="w-full text-sm text-muted underline"
          >
            Back
          </button>
        </motion.div>
      )}
    </div>
  )
}
