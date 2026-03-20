import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, Loader2 } from 'lucide-react'
import { useRoomContext } from '../context/RoomContext'
import { useApp } from '../context/AppContext'
import { useRestaurants } from '../hooks/useRestaurants'
import { pickRandom, randomPaymentSplit } from '../lib/utils'
import RestaurantCard from '../components/RestaurantCard'
import RitualAnimation from '../components/RitualAnimation'
import type { Restaurant } from '../types'

export default function DuelMode() {
  const { room, playerId, isHost, setDuel, setResults } = useRoomContext()
  const { state } = useApp()
  const { search, loading: searchLoading } = useRestaurants()
  const [myPick, setMyPick] = useState<Restaurant | null>(null)
  const [searchResults, setSearchResults] = useState<Restaurant[]>([])
  const [dueling, setDueling] = useState(false)

  if (!room) return null

  const duel = room.duel
  const players = room.players
  const duelists = duel
    ? [players.find(p => p.id === duel.player1Id), players.find(p => p.id === duel.player2Id)]
    : players.slice(0, 2)

  const amDuelist = duelists.some(d => d?.id === playerId)

  const handleSearch = async () => {
    if (!state.location) return
    const results = await search(state.location.lat, state.location.lng, 3000)
    setSearchResults(results)
  }

  const handlePick = (restaurant: Restaurant) => {
    setMyPick(restaurant)
    if (!duel) {
      setDuel({
        player1Id: players[0]?.id ?? '',
        player2Id: players[1]?.id ?? '',
        ...(playerId === players[0]?.id
          ? { player1Pick: restaurant }
          : { player2Pick: restaurant }),
      })
    } else {
      setDuel({
        ...duel,
        ...(playerId === duel.player1Id
          ? { player1Pick: restaurant }
          : { player2Pick: restaurant }),
      })
    }
  }

  const handleStartDuel = () => {
    if (!duel) return
    setDueling(true)
    setTimeout(() => {
      const winnerId = pickRandom([duel.player1Id, duel.player2Id])
      const loserId = winnerId === duel.player1Id ? duel.player2Id : duel.player1Id
      setResults({
        winnerId,
        loserId,
        paymentSplit: randomPaymentSplit(),
        ritualName: 'Duel',
      })
    }, 3000)
  }

  if (dueling) {
    return <RitualAnimation text="Dueling..." subtext="Fate is deciding the winner" />
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Swords className="w-5 h-5 text-muted" />
        <h2 className="text-lg font-bold text-primary">Duel Mode</h2>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-surface-lighter border border-zinc-700 flex items-center justify-center text-lg font-bold text-primary">
            {duelists[0]?.nickname.charAt(0).toUpperCase()}
          </div>
          <p className="text-xs text-muted mt-1">{duelists[0]?.nickname}</p>
        </div>
        <span className="text-muted text-lg font-bold">vs</span>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-surface-lighter border border-zinc-700 flex items-center justify-center text-lg font-bold text-primary">
            {duelists[1]?.nickname.charAt(0).toUpperCase()}
          </div>
          <p className="text-xs text-muted mt-1">{duelists[1]?.nickname}</p>
        </div>
      </div>

      {amDuelist && !myPick && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-muted">Pick your restaurant:</p>
          {searchResults.length === 0 ? (
            <button
              onClick={handleSearch}
              disabled={searchLoading || !state.location}
              className="w-full py-3 rounded-xl bg-primary text-surface font-semibold text-sm flex items-center justify-center gap-2"
            >
              {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {searchLoading ? 'Searching...' : 'Find Restaurants'}
            </button>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
              {searchResults.map(r => (
                <RestaurantCard key={r.id} restaurant={r} onSelect={handlePick} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {myPick && (
        <p className="text-sm text-success text-center">You picked: {myPick.name}</p>
      )}

      {!amDuelist && (
        <p className="text-sm text-muted text-center py-4">Watching the duel...</p>
      )}

      {isHost && duel?.player1Pick && duel?.player2Pick && (
        <button
          onClick={handleStartDuel}
          className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95"
        >
          Start Duel
        </button>
      )}
    </div>
  )
}
