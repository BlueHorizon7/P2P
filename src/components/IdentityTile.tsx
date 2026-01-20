import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

export interface IdentityTileProps {
  nodeId: string | null
}

export const IdentityTile = ({ nodeId }: IdentityTileProps) => {
  const displayId = nodeId ?? 'kernel-initializing'

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-card col-span-2 row-span-2 p-5 md:p-6 flex flex-col md:flex-row gap-6"
    >
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/80 flex items-center justify-center shadow-[0_0_20px_rgba(129,140,248,0.65)]">
            <Cpu className="text-white" size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-300/80">
              Shadow Kernel
            </p>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              Node Identity
            </h2>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <p className="text-xs font-mono text-gray-400 uppercase">
            Node ID
          </p>
          <p className="font-mono text-sm md:text-base text-emerald-300 break-all">
            {displayId}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
          <span className="font-mono bg-white/5 rounded-full px-3 py-1 border border-white/10">
            mode:&nbsp;
            <span className="text-indigo-300">
              anonymous-node
            </span>
          </span>
          <span className="font-mono bg-white/5 rounded-full px-3 py-1 border border-white/10">
            status:&nbsp;
            <span className={nodeId ? 'text-emerald-300' : 'text-yellow-300'}>
              {nodeId ? 'online' : 'booting'}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center md:justify-end">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-indigo-500/40 via-cyan-400/30 to-violet-500/30 rounded-3xl" />
          <div className="relative rounded-3xl border border-white/15 bg-black/60 p-4 shadow-2xl flex flex-col items-center gap-3">
            <QRCodeSVG
              value={displayId}
              size={148}
              bgColor="transparent"
              fgColor="#e5e7eb"
              includeMargin={false}
              level="M"
            />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
              Scan to connect
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}


