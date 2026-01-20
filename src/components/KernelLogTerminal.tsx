import { motion } from 'framer-motion'
import type { NetworkLog } from '../utils/useShadowNetwork'

export interface KernelLogTerminalProps {
  logs: NetworkLog[]
}

const typeColorMap: Record<NetworkLog['type'], string> = {
  info: 'text-emerald-300',
  success: 'text-emerald-400',
  warning: 'text-amber-300',
  error: 'text-rose-300',
}

export const KernelLogTerminal = ({ logs }: KernelLogTerminalProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
      className="glass-card row-span-3 p-4 md:p-5 flex flex-col"
    >
      <header className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-300/80">
            Kernel Log
          </p>
          <h2 className="text-sm font-semibold tracking-tight">
            Event stream
          </h2>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {logs.length.toString().padStart(2, '0')} entries
        </span>
      </header>

      <div className="relative flex-1 rounded-lg border border-emerald-400/20 bg-black/70 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/10" />
        <div className="relative h-full overflow-y-auto px-3 py-2 font-mono text-[11px] text-emerald-300 space-y-1">
          {logs.length === 0 ? (
            <p className="text-emerald-400/60">
              ▷ awaiting kernel events… connect to a peer to see activity
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-2 whitespace-pre-wrap leading-relaxed"
              >
                <span className="text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={typeColorMap[log.type]}>
                  [{log.type.toUpperCase()}]
                </span>
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  )
}


