import { createFileRoute } from '@tanstack/react-router'
import { AntigravityEditor } from '../components/AntigravityEditor'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/forge')({
  component: ForgePage,
})

function ForgePage() {
  const roomId = 'main'

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-indigo-300/80">
            The Forge
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Collaborative IDE
          </h1>
          <p className="mt-1 text-xs md:text-sm text-gray-400 max-w-xl">
            Join the same Forge room on multiple devices to co-edit code in
            real time over Yjs + y-webrtc. Shadow OS takes care of the
            synchronization.
          </p>
        </div>
      </header>

      <motion.div
        className="flex-1 min-h-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <AntigravityEditor roomId={roomId} />
      </motion.div>
    </div>
  )
}

