import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Peer, {
  type DataConnection,
  type MediaConnection,
} from 'peerjs'

export interface NetworkLog {
  id: string
  timestamp: number
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
}

export interface ReceivedFile {
  id: string
  fromPeerId: string
  name: string
  mimeType: string
  size: number
  createdAt: number
  blob: Blob
  objectUrl: string
}

export interface ChatMessage {
  id: string
  fromPeerId: string
  text: string
  createdAt: number
}

type FileChunkMessage = {
  type: 'file-chunk'
  fileId: string
  name: string
  mimeType: string
  size: number
  index: number
  totalChunks: number
  data: ArrayBuffer
}

type FileCompleteMessage = {
  type: 'file-complete'
  fileId: string
}

type SimpleTextMessage = {
  type: 'text'
  text: string
}

type ChatPacketMessage = {
  type: 'chat'
  text: string
  fromPeerId: string
  createdAt: number
}

type PeerMessage =
  | FileChunkMessage
  | FileCompleteMessage
  | SimpleTextMessage
  | ChatPacketMessage

interface IncomingFileBuffer {
  fromPeerId: string
  name: string
  mimeType: string
  size: number
  chunks: ArrayBuffer[]
  totalChunks: number
}

const FILE_CHUNK_SIZE = 64 * 1024 // 64KB

const isPeerMessage = (data: unknown): data is PeerMessage => {
  if (!data || typeof data !== 'object') return false
  const maybe = data as { type?: unknown }
  return typeof maybe.type === 'string'
}

const generateId = (): string =>
  Math.random().toString(36).slice(2, 11)

export const useShadowNetwork = () => {
  const [logs, setLogs] = useState<NetworkLog[]>([])
  const [peer, setPeer] = useState<Peer | null>(null)
  const [nodeId, setNodeId] = useState<string | null>(null)
  const [connections, setConnections] = useState<
    Map<string, DataConnection>
  >(new Map())
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const peerRef = useRef<Peer | null>(null)
  const mediaConnectionsRef = useRef<Map<string, MediaConnection>>(
    new Map(),
  )
  const incomingFilesRef = useRef<Map<string, IncomingFileBuffer>>(
    new Map(),
  )

  const addLog = useCallback((type: NetworkLog['type'], message: string) => {
    const log: NetworkLog = {
      id: generateId(),
      timestamp: Date.now(),
      type,
      message,
    }
    setLogs((prev) => [log, ...prev].slice(0, 200))
  }, [])

  const finalizeIncomingFile = useCallback(
    (fileId: string) => {
      const buffer = incomingFilesRef.current.get(fileId)
      if (!buffer) return

      const { chunks, name, mimeType, size, fromPeerId } = buffer
      const blob = new Blob(chunks, { type: mimeType })
      const objectUrl = URL.createObjectURL(blob)

      setReceivedFiles((prev) => [
        {
          id: fileId,
          fromPeerId,
          name,
          mimeType,
          size,
          createdAt: Date.now(),
          blob,
          objectUrl,
        },
        ...prev,
      ])

      incomingFilesRef.current.delete(fileId)
      addLog(
        'success',
        `File received from ${fromPeerId}: ${name} (${Math.round(
          size / 1024,
        )} KB)`,
      )
    },
    [addLog],
  )

  const handleIncomingData = useCallback(
    (senderId: string, data: PeerMessage) => {
      if (data.type === 'file-chunk') {
        const existing = incomingFilesRef.current.get(data.fileId)

        const buffer: IncomingFileBuffer = existing ?? {
          fromPeerId: senderId,
          name: data.name,
          mimeType: data.mimeType,
          size: data.size,
          chunks: [],
          totalChunks: data.totalChunks,
        }

        buffer.chunks[data.index] = data.data
        incomingFilesRef.current.set(data.fileId, buffer)

        if (buffer.chunks.filter(Boolean).length === buffer.totalChunks) {
          finalizeIncomingFile(data.fileId)
        }

        return
      }

      if (data.type === 'file-complete') {
        finalizeIncomingFile(data.fileId)
        return
      }

      if (data.type === 'text') {
        addLog('info', `Message from ${senderId}: ${data.text}`)
        return
      }

      if (data.type === 'chat') {
        const message: ChatMessage = {
          id: `${senderId}-${data.createdAt}-${generateId()}`,
          fromPeerId: data.fromPeerId,
          text: data.text,
          createdAt: data.createdAt,
        }
        setMessages((prev) => [...prev, message])
        addLog('info', `Chat from ${senderId}: ${data.text}`)
      }
    },
    [addLog, finalizeIncomingFile],
  )

  const setupConnection = useCallback(
    (conn: DataConnection) => {
      conn.on('open', () => {
        addLog('success', `Secure channel established with ${conn.peer}`)
        setConnections((prev) => {
          const next = new Map(prev)
          next.set(conn.peer, conn)
          return next
        })
      })

      conn.on('data', (rawData) => {
        if (isPeerMessage(rawData)) {
          addLog(
            'info',
            `Packet received from ${conn.peer}: ${rawData.type}`,
          )
          handleIncomingData(conn.peer, rawData)
        } else {
          addLog(
            'warning',
            `Unknown packet type from ${conn.peer}. Ignoring.`,
          )
        }
      })

      conn.on('close', () => {
        addLog('warning', `Connection terminated: ${conn.peer}`)
        setConnections((prev) => {
          const next = new Map(prev)
          next.delete(conn.peer)
          return next
        })
      })

      conn.on('error', (err) => {
        addLog(
          'error',
          `Connection error with ${conn.peer}: ${err.message ?? 'Unknown error'}`,
        )
      })
    },
    [addLog, handleIncomingData],
  )

  // Initialize Peer
  useEffect(() => {
    if (peerRef.current) return

    // Generate or restore a stable node ID for this browser profile
    const existingId =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('shadow-node-id')
        : null

    const baseId = existingId ?? `shadow-${generateId()}`
    const sanitized = baseId.replace(/[^a-zA-Z0-9_-]/g, '')
    const finalId = sanitized.length > 0 ? sanitized : `shadow-${generateId()}`

    if (!existingId && typeof window !== 'undefined') {
      window.localStorage.setItem('shadow-node-id', finalId)
    }

    addLog('info', `Initializing Shadow Node with ID: ${finalId}...`)

    const newPeer = new Peer(finalId, {
      debug: 2,
    })

    setNodeId(finalId)

    newPeer.on('open', (id) => {
      addLog('success', `Node active. Identity confirmed: ${id}`)
      setPeer(newPeer)
    })

    newPeer.on('connection', (conn) => {
      addLog('info', `Incoming connection request from ${conn.peer}`)
      setupConnection(conn)
    })

    newPeer.on('call', (mediaConn) => {
      addLog('info', `Incoming media stream from ${mediaConn.peer}`)
      mediaConnectionsRef.current.set(mediaConn.peer, mediaConn)
      mediaConn.on('close', () => {
        mediaConnectionsRef.current.delete(mediaConn.peer)
        addLog('warning', `Media stream closed from ${mediaConn.peer}`)
      })
    })

    newPeer.on('error', (err) => {
      addLog('error', `Peer Error: ${err.type} - ${err.message}`)
    })

    newPeer.on('disconnected', () => {
      addLog(
        'warning',
        'Peer disconnected from signaling server. Reconnecting...',
      )
      newPeer.reconnect()
    })

    peerRef.current = newPeer

    return () => {
      newPeer.destroy()
      peerRef.current = null
      setPeer(null)
      setConnections(new Map())
    }
  }, [addLog, setupConnection])

  const connect = useCallback(
    (targetIdRaw: string) => {
      const currentPeer = peerRef.current
      const trimmed = targetIdRaw.trim()

      if (!currentPeer) {
        addLog('error', 'Kernel not ready. Cannot connect.')
        return
      }

      if (!trimmed) {
        addLog('warning', 'Target ID cannot be empty.')
        return
      }

      if (trimmed === currentPeer.id) {
        addLog('warning', 'Cannot connect to self.')
        return
      }

      addLog('info', `Initiating handshake with ${trimmed}...`)
      const conn = currentPeer.connect(trimmed)
      setupConnection(conn)
    },
    [addLog, setupConnection],
  )

  const sendFile = useCallback(
    async (file: File) => {
      if (!peerRef.current) {
        addLog('error', 'Kernel not ready. Cannot send file.')
        return
      }

      if (connections.size === 0) {
        addLog('warning', 'No active connections to send file.')
        return
      }

      const arrayBuffer = await file.arrayBuffer()
      const totalChunks = Math.ceil(arrayBuffer.byteLength / FILE_CHUNK_SIZE)
      const fileId = `${peerRef.current.id}-${Date.now()}-${generateId()}`

      addLog(
        'info',
        `Transmitting ${file.name} to ${connections.size} peer(s)...`,
      )

      const chunkView = new Uint8Array(arrayBuffer)

      connections.forEach((conn) => {
        for (let index = 0; index < totalChunks; index++) {
          const start = index * FILE_CHUNK_SIZE
          const end = Math.min(start + FILE_CHUNK_SIZE, chunkView.length)
          const slice = chunkView.slice(start, end)

          const message: FileChunkMessage = {
            type: 'file-chunk',
            fileId,
            name: file.name,
            mimeType: file.type,
            size: file.size,
            index,
            totalChunks,
            data: slice.buffer,
          }

          conn.send(message)
        }

        const completeMessage: FileCompleteMessage = {
          type: 'file-complete',
          fileId,
        }
        conn.send(completeMessage)
      })

      addLog(
        'success',
        `File dispatch complete: ${file.name} (${Math.round(
          file.size / 1024,
        )} KB)`,
      )
    },
    [addLog, connections],
  )

  const sendStream = useCallback(
    (targetIdRaw: string, stream: MediaStream) => {
      const currentPeer = peerRef.current
      const trimmed = targetIdRaw.trim()

      if (!currentPeer) {
        addLog('error', 'Kernel not ready. Cannot send media stream.')
        return
      }

      if (!trimmed) {
        addLog('warning', 'Target ID cannot be empty.')
        return
      }

      if (trimmed === currentPeer.id) {
        addLog('warning', 'Cannot send stream to self.')
        return
      }

      const mediaConn = currentPeer.call(trimmed, stream)
      mediaConnectionsRef.current.set(trimmed, mediaConn)
      addLog('info', `Media stream initiated to ${trimmed}`)

      mediaConn.on('close', () => {
        mediaConnectionsRef.current.delete(trimmed)
        addLog('warning', `Media stream closed for ${trimmed}`)
      })
    },
    [addLog],
  )

  const sendChat = useCallback(
    (text: string) => {
      const currentPeer = peerRef.current
      const trimmed = text.trim()

      if (!currentPeer) {
        addLog('error', 'Kernel not ready. Cannot send chat.')
        return
      }

      if (!trimmed) {
        return
      }

      const createdAt = Date.now()
      const localMessage: ChatMessage = {
        id: `${currentPeer.id}-${createdAt}-${generateId()}`,
        fromPeerId: currentPeer.id,
        text: trimmed,
        createdAt,
      }

      setMessages((prev) => [...prev, localMessage])

      const packet: ChatPacketMessage = {
        type: 'chat',
        text: trimmed,
        fromPeerId: currentPeer.id,
        createdAt,
      }

      connections.forEach((conn) => {
        conn.send(packet)
      })

      addLog('info', `Chat broadcast: ${trimmed}`)
    },
    [addLog, connections],
  )

  return {
    peer,
    nodeId,
    logs,
    connections,
    receivedFiles,
    messages,
    connect,
    sendFile,
    sendStream,
    sendChat,
  }
}


