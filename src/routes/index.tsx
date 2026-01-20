import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Activity, Code2, HardDrive } from 'lucide-react'
import { IdentityTile } from '../components/IdentityTile'
import { ConnectionTile } from '../components/ConnectionTile'
import { KernelLogTerminal } from '../components/KernelLogTerminal'
import { useShadowNetwork } from '../utils/useShadowNetwork'

export const Route = createFileRoute('/')({
  component: ShadowDashboard,
})

function ShadowDashboard() {
  const { nodeId, logs, connect, peer } = useShadowNetwork()

  const isKernelReady = Boolean(peer && nodeId)

  return (
    <div className="h-full w-full flex flex-col gap-4 md:gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-indigo-300/80">
            Shadow OS
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Control Deck
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-[0.18em]">
              {isKernelReady ? 'Kernel Online' : 'Booting Kernel'}
            </span>
          </span>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-1 lg:grid-cols-4 auto-rows-[minmax(110px,_auto)] gap-4 md:gap-5 lg:gap-6"
      >
        {/* Left bento column: identity + connection */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(110px,_auto)] gap-4 md:gap-5">
          <IdentityTile nodeId={nodeId} />

          <ConnectionTile
            isKernelReady={isKernelReady}
            nodeId={nodeId}
            onConnect={connect}
          />

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
            className="glass-card col-span-1 md:col-span-2 p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-500/70 flex items-center justify-center shadow-[0_0_18px_rgba(139,92,246,0.7)]">
                  <Code2 size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-violet-200/80">
                    Forge
                  </p>
                  <h2 className="text-sm font-semibold tracking-tight">
                    Real-time IDE
                  </h2>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                /forge
              </span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Enter the Forge to co-edit code with connected peers using
              Monaco + Yjs. Remote cursors, live presence, and conflict-free
              merging keep your swarm in sync.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.16 }}
            className="glass-card col-span-1 md:col-span-2 p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/70 flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.7)]">
                  <HardDrive size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                    Vault
                  </p>
                  <h2 className="text-sm font-semibold tracking-tight">
                    P2P file grid
                  </h2>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                /vault
              </span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Drag and drop assets into the Vault to send them across your
              peer mesh. Files are chunked into 64KB packets and reassembled
              on arrival with inline previews.
            </p>
          </motion.section>
        </div>

        {/* Right column: kernel terminal */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/70 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.7)]">
              <Activity size={16} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-200/80">
                Telemetry
              </p>
              <p className="text-xs text-gray-200 font-mono">
                PeerJS · Clerk · Yjs · Vault
              </p>
            </div>
          </div>

          <KernelLogTerminal logs={logs} />
        </div>
      </motion.main>
    </div>
  )
}

