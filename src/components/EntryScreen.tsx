import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function EntryScreen() {
  const { dispatch } = useApp()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="text-5xl font-bold tracking-tight text-primary mb-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Decider
      </motion.h1>

      <motion.p
        className="text-lg text-muted mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Stop choosing.
      </motion.p>

      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'solo' })}
          className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-base transition-transform active:scale-95"
        >
          Decide for me
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'group' })}
          className="w-full py-3.5 rounded-xl border border-zinc-700 text-primary font-semibold text-base transition-transform active:scale-95"
        >
          We decide together
        </button>
      </motion.div>
    </motion.div>
  )
}
