import { useRoomContext } from '../context/RoomContext'
import LastOneStanding from './rituals/LastOneStanding'
import WheelOfFate from './rituals/WheelOfFate'
import InstantDraw from './rituals/InstantDraw'
import CreativeRituals from './rituals/CreativeRituals'

export default function OutcomeRitual() {
  const { room } = useRoomContext()

  if (!room) return null

  switch (room.ritual) {
    case 'last-one-standing':
      return <LastOneStanding />
    case 'wheel-of-fate':
      return <WheelOfFate />
    case 'instant-draw':
      return <InstantDraw />
    case 'creative':
      return <CreativeRituals />
    default:
      return <p className="text-sm text-muted text-center py-8">Unknown ritual</p>
  }
}
