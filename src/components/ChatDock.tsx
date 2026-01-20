import { useMemo, useRef, useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageCircle } from 'lucide-react'
import type { ChatMessage } from '../utils/useShadowNetwork'

export interface ChatDockProps {
  nodeId: string | null
  messages: ChatMessage[]
  onSend: (text: string) => void
}

export const ChatDock = ({ nodeId, messages, onSend }: ChatDockProps) => {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt - b.createdAt),
    [messages],
  )

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [sortedMessages.length])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onSend(trimmed)
    setDraft('')
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-card mt-4 rounded-2xl border border-white/10 flex flex-col max-h-72"
    >
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/70 flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.7)]">
            <MessageCircle size={14} className="text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide">
              Mesh Console
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              node: {nodeId ?? 'booting'}
            </span>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-2 space-y-1.5 font-mono text-[11px]"
      >
        {sortedMessages.length === 0 ? (
          <p className="text-gray-400">
            No messages yet. Type below to broadcast to connected peers.
          </p>
        ) : (
          sortedMessages.map((msg) => {
            const isSelf = nodeId && msg.fromPeerId === nodeId
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isSelf ? 'justify-end' : 'justify-start'
                } text-[11px]`}
              >
                <span
                  className={`inline-flex max-w-[80%] rounded-lg px-2 py-1 ${
                    isSelf
                      ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-100'
                      : 'bg-white/5 border border-white/10 text-gray-100'
                  }`}
                >
                  {!isSelf && (
                    <span className="mr-1 text-[10px] text-gray-400">
                      {msg.fromPeerId.slice(0, 6)}:
                    </span>
                  )}
                  <span>{msg.text}</span>
                </span>
              </div>
            )
          })
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 border-t border-white/10 bg-black/60"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Send a mesh broadcast…"
          className="flex-1 bg-black/50 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-mono bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.7)] transition-colors"
        >
          <Send size={12} />
          Send
        </button>
      </form>
    </motion.section>
  )
}


