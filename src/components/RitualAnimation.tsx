import { motion } from 'framer-motion'

interface Props {
  text: string
  subtext?: string
  onComplete?: () => void
}

export default function RitualAnimation({ text, subtext, onComplete }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="relative w-24 h-24 mb-6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" />
        <div className="absolute inset-2 rounded-full border border-zinc-800" />
        <div className="absolute inset-2 rounded-full border border-transparent border-b-muted" />
      </motion.div>

      <motion.p
        className="text-lg font-semibold text-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
      {subtext && (
        <p className="text-sm text-muted mt-2">{subtext}</p>
      )}
    </motion.div>
  )
}
