import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link2, Send } from 'lucide-react'

export interface ConnectionTileProps {
  isKernelReady: boolean
  nodeId: string | null
  onConnect: (targetId: string) => void
}

export const ConnectionTile = ({
  isKernelReady,
  nodeId,
  onConnect,
}: ConnectionTileProps) => {
  const [targetId, setTargetId] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = targetId.trim()
    if (!trimmed) return
    onConnect(trimmed)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
      className="glass-card col-span-2 p-5 md:p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/70 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.7)]">
            <Link2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
              Link Channel
            </p>
            <h2 className="text-sm md:text-base font-semibold tracking-tight">
              Connect to a peer
            </h2>
          </div>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          self:{' '}
          <span className="text-gray-300">
            {nodeId ? nodeId.slice(0, 8) + '…' : 'initializing'}
          </span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            placeholder="Paste peer node ID or scan QR → paste"
            className="w-full rounded-lg bg-black/50 border border-white/15 px-3 py-2.5 text-sm font-mono text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
          />
          {!isKernelReady && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-yellow-300">
              booting…
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!isKernelReady}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide uppercase bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.65)] hover:bg-cyan-400 disabled:bg-gray-600 disabled:text-gray-300 disabled:shadow-none transition-all"
        >
          <Send size={14} />
          Handshake
        </button>
      </form>

      <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
        Connection requests are routed via PeerJS and bound to your Clerk
        identity. Share your Node ID or QR from the identity tile to establish a
        secure channel.
      </p>
    </motion.section>
  )
}


