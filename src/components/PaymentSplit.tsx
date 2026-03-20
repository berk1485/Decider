import { motion } from 'framer-motion'
import type { PaymentSplit as PaymentSplitType } from '../types'
import { formatPaymentSplit } from '../lib/utils'

interface Props {
  split: PaymentSplitType
  winnerName: string
  loserName: string
}

export default function PaymentSplitDisplay({ split, winnerName, loserName }: Props) {
  const { winner, loser } = formatPaymentSplit(split)

  return (
    <motion.div
      className="w-full p-4 rounded-xl bg-surface-lighter border border-zinc-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs text-muted uppercase tracking-wider mb-3">Payment Split</p>
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="text-sm text-muted">{loserName}</p>
          <p className="text-2xl font-bold text-danger">{loser}</p>
          <p className="text-xs text-muted mt-1">pays</p>
        </div>
        <div className="w-px h-12 bg-zinc-700" />
        <div className="text-center flex-1">
          <p className="text-sm text-muted">{winnerName}</p>
          <p className="text-2xl font-bold text-success">{winner}</p>
          <p className="text-xs text-muted mt-1">pays</p>
        </div>
      </div>
    </motion.div>
  )
}
