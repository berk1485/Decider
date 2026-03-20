import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { generateRoomCode, generatePlayerId } from '../lib/utils'
import type { Player, Room, RoomPhase, RitualType, RitualResult, DuelState } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRoom() {
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId] = useState(() => generatePlayerId())
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setRoom(null)
  }, [])

  const joinChannel = useCallback((code: string, nickname: string, isHost: boolean) => {
    cleanup()
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: playerId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const players: Player[] = Object.entries(presenceState).map(([id, data]) => {
          const info = (data as unknown[])[0] as { nickname: string; isHost: boolean; role?: string; restaurantPick?: unknown }
          return {
            id,
            nickname: info.nickname,
            isHost: info.isHost,
            role: info.role as Player['role'],
            restaurantPick: info.restaurantPick as Player['restaurantPick'],
          }
        })
        setRoom(prev => prev ? { ...prev, players } : {
          code,
          players,
          phase: 'lobby',
        })
      })
      .on('broadcast', { event: 'game' }, ({ payload }) => {
        const msg = payload as {
          type: string
          phase?: RoomPhase
          ritual?: RitualType
          results?: RitualResult
          duel?: DuelState
        }
        setRoom(prev => {
          if (!prev) return prev
          switch (msg.type) {
            case 'phase':
              return { ...prev, phase: msg.phase ?? prev.phase }
            case 'ritual':
              return { ...prev, ritual: msg.ritual, phase: 'ritual-active' }
            case 'results':
              return { ...prev, results: msg.results, phase: 'results' }
            case 'duel':
              return { ...prev, duel: msg.duel }
            default:
              return prev
          }
        })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ nickname, isHost })
        }
      })

    channelRef.current = channel
  }, [playerId, cleanup])

  const createRoom = useCallback((nickname: string) => {
    const code = generateRoomCode()
    joinChannel(code, nickname, true)
    return code
  }, [joinChannel])

  const joinRoom = useCallback((code: string, nickname: string) => {
    setError(null)
    joinChannel(code.toUpperCase(), nickname, false)
  }, [joinChannel])

  const broadcast = useCallback((event: string, payload: Record<string, unknown>) => {
    if (!channelRef.current) return
    channelRef.current.send({ type: 'broadcast', event, payload })
  }, [])

  const setPhase = useCallback((phase: RoomPhase) => {
    broadcast('game', { type: 'phase', phase })
    setRoom(prev => prev ? { ...prev, phase } : prev)
  }, [broadcast])

  const startRitual = useCallback((ritual: RitualType) => {
    broadcast('game', { type: 'ritual', ritual })
    setRoom(prev => prev ? { ...prev, ritual, phase: 'ritual-active' } : prev)
  }, [broadcast])

  const setResults = useCallback((results: RitualResult) => {
    broadcast('game', { type: 'results', results })
    setRoom(prev => prev ? { ...prev, results, phase: 'results' } : prev)
  }, [broadcast])

  const setDuel = useCallback((duel: DuelState) => {
    broadcast('game', { type: 'duel', duel })
    setRoom(prev => prev ? { ...prev, duel } : prev)
  }, [broadcast])

  useEffect(() => {
    return () => { cleanup() }
  }, [cleanup])

  const isHost = room?.players.find(p => p.id === playerId)?.isHost ?? false

  return {
    room,
    playerId,
    isHost,
    error,
    createRoom,
    joinRoom,
    setPhase,
    startRitual,
    setResults,
    setDuel,
    broadcast,
    cleanup,
  }
}
