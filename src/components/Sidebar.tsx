import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Code2,
  HardDrive,
  Cpu,
} from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const NavItem = ({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}) => {
  const router = useRouterState()
  const isActive = router.location.pathname === to

  return (
    <Link
      to={to}
      className={clsx(
        'group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
        isActive
          ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
          : 'text-gray-400 hover:text-white hover:bg-white/5',
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
        />
      )}
      <Icon
        size={20}
        className={clsx(
          'transition-transform group-hover:scale-110',
          isActive && 'text-indigo-400',
        )}
      />
      <span className="font-medium tracking-wide">{label}</span>
    </Link>
  )
}

export const Sidebar = () => {
  const router = useRouterState()

  return (
    <>
      {/* Mobile top nav */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden fixed top-0 left-0 right-0 z-30 glass-panel border-b border-white/10 px-3 py-2 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Cpu className="text-white" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide">SHADOW OS</span>
            <span className="text-[10px] text-gray-400 font-mono">
              {router.location.pathname}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Link
            to="/"
            className={clsx(
              'px-2 py-1 rounded-md font-mono',
              router.location.pathname === '/' ? 'bg-white/15' : 'text-gray-300',
            )}
          >
            Dash
          </Link>
          <Link
            to="/forge"
            className={clsx(
              'px-2 py-1 rounded-md font-mono',
              router.location.pathname === '/forge'
                ? 'bg-white/15'
                : 'text-gray-300',
            )}
          >
            Forge
          </Link>
          <Link
            to="/vault"
            className={clsx(
              'px-2 py-1 rounded-md font-mono',
              router.location.pathname === '/vault'
                ? 'bg-white/15'
                : 'text-gray-300',
            )}
          >
            Vault
          </Link>
        </div>
      </motion.nav>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex w-64 h-full glass-panel border-r border-white/10 flex-col p-4 z-20"
      >
        <div className="flex items-center gap-3 px-2 py-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-wider">SHADOW</h2>
            <p className="text-xs text-gray-500 font-mono">v1.0.0-alpha</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/forge" icon={Code2} label="The Forge" />
          <NavItem to="/vault" icon={HardDrive} label="The Vault" />
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-mono">
              OS
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-gray-300 uppercase tracking-wide">
                Shadow OS
              </span>
              <span className="text-[10px] text-gray-500">
                Peer-to-peer · No central auth
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
