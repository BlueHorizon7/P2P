import { useEffect, useMemo, useRef, useState } from 'react'
import { Monaco } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { motion } from 'framer-motion'
import { Circle, Users } from 'lucide-react'

type AntigravityEditorProps = {
  roomId: string
}

type AwarenessUser = {
  clientId: number
  color: string
}

const COLORS = [
  '#22c55e',
  '#06b6d4',
  '#a855f7',
  '#f97316',
  '#e11d48',
  '#eab308',
]

export const AntigravityEditor = ({ roomId }: AntigravityEditorProps) => {
  const [connectedPeers, setConnectedPeers] = useState<number>(1)
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessUser[]>([])
  const editorRef = useRef<Monaco | null>(null)

  const { doc, provider } = useMemo(() => {
    const ydoc = new Y.Doc()
    const webrtc = new WebrtcProvider(`shadow-forge-${roomId}`, ydoc, {
      password: undefined,
    })
    return { doc: ydoc, provider: webrtc }
  }, [roomId])

  useEffect(() => {
    const yText = doc.getText('code')

    // Peer count
    const handlePeersUpdate = () => {
      setConnectedPeers(provider.awareness.getStates().size || 1)
    }
    provider.on('peers', handlePeersUpdate)
    handlePeersUpdate()

    // Awareness users list
    const handleAwarenessChange = () => {
      const users: AwarenessUser[] = []
      provider.awareness.getStates().forEach((_state, clientId) => {
        const color = COLORS[clientId % COLORS.length] ?? COLORS[0]
        users.push({ clientId, color })
      })
      setAwarenessUsers(users)
    }
    provider.awareness.on('change', handleAwarenessChange)
    handleAwarenessChange()

    return () => {
      provider.off('peers', handlePeersUpdate)
      provider.awareness.off('change', handleAwarenessChange)
      provider.destroy()
      doc.destroy()
    }
  }, [doc, provider])

  const handleEditorMount = (editorInstance: any, monacoInstance: Monaco) => {
    editorRef.current = monacoInstance
    const yText = doc.getText('code')

    // Bind Monaco model to Yjs text
    const model = editorInstance.getModel()
    if (!model) return

    // Initialize from Yjs or from current model
    if (yText.length === 0) {
      yText.insert(
        0,
        `// Shadow Forge
// This buffer is shared over Yjs + y-webrtc.

function greet(peerId) {
  console.log('Hello from Shadow OS node', peerId)
}
`,
      )
    } else {
      model.setValue(yText.toString())
    }

    const updateModelFromYjs = () => {
      const value = yText.toString()
      if (model.getValue() !== value) {
        model.setValue(value)
      }
    }

    const yObserver = (event: Y.YTextEvent) => {
      updateModelFromYjs()
    }

    yText.observe(yObserver)

    const sub = model.onDidChangeContent((e: any) => {
      const newValue = model.getValue()
      if (newValue !== yText.toString()) {
        yText.delete(0, yText.length)
        yText.insert(0, newValue)
      }
    })

    updateModelFromYjs()

    editorInstance.onDidDispose(() => {
      sub.dispose()
      yText.unobserve(yObserver)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="glass-panel relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/10"
    >
      <header className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-3 text-xs font-mono text-gray-300">
            forge://{roomId}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-300 font-mono">
          <span className="inline-flex items-center gap-1">
            <Users size={13} className="text-cyan-400" />
            <span>{connectedPeers} peers</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Circle size={10} className="text-emerald-400" />
            <span>Yjs · y-webrtc</span>
          </span>
        </div>
      </header>

      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/10 bg-black/60 text-[10px] font-mono text-gray-400">
        {awarenessUsers.length === 0 ? (
          <span>waiting for collaborators… open this URL in another device</span>
        ) : (
          awarenessUsers.map((user) => (
            <span
              key={user.clientId}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-white/5 border border-white/10"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span>peer-{user.clientId}</span>
            </span>
          ))
        )}
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          options={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            minimap: { enabled: false },
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
          }}
          onMount={handleEditorMount}
        />
      </div>
    </motion.div>
  )
}


