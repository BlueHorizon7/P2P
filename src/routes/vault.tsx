import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { Image as ImageIcon, FileIcon, Video, Download, X } from 'lucide-react'
import { useShadowNetwork } from '../utils/useShadowNetwork'
import type { ReceivedFile } from '../utils/useShadowNetwork'
import { useCallback, useMemo, useState, type DragEvent } from 'react'

export const Route = createFileRoute('/vault')({
  component: VaultPage,
})

function VaultPage() {
  const { sendFile, receivedFiles } = useShadowNetwork()
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState<ReceivedFile | null>(null)

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)

      const files = Array.from(event.dataTransfer.files ?? [])
      for (const file of files) {
        await sendFile(file)
      }
    },
    [sendFile],
  )

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const sortedFiles = useMemo(
    () => [...receivedFiles].sort((a, b) => b.createdAt - a.createdAt),
    [receivedFiles],
  )

  const renderFileIcon = (file: ReceivedFile) => {
    if (file.mimeType.startsWith('image/')) {
      return <ImageIcon size={18} className="text-cyan-300" />
    }
    if (file.mimeType.startsWith('video/')) {
      return <Video size={18} className="text-violet-300" />
    }
    return <FileIcon size={18} className="text-gray-300" />
  }

  const isPreviewable = (file: ReceivedFile) =>
    file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/80">
            The Vault
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            P2P File Grid
          </h1>
          <p className="mt-1 text-xs md:text-sm text-gray-400 max-w-xl">
            Drop files into the Vault to dispatch them as 64KB chunks across
            your peer mesh. Incoming files crystallize here as cards with inline
            previews.
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="lg:w-1/3 flex flex-col gap-3"
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`glass-panel flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/20 bg-black/40'
            } px-4 py-8 text-center transition-colors`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-300/40 flex items-center justify-center">
                <ImageIcon className="text-cyan-300" size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold">Drop files to dispatch</p>
                <p className="text-xs text-gray-400 mt-1">
                  Any images, videos, or documents will be streamed over Shadow
                  Kernel channels to connected peers.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl px-4 py-3 text-[11px] text-gray-300 font-mono">
            <p className="mb-1 text-xs uppercase tracking-[0.18em] text-gray-400">
              Transfer protocol
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>files chunked into 64KB packets</li>
              <li>reassembled into Blob on receipt</li>
              <li>previewable assets open in-line</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
          className="lg:w-2/3 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
            <p className="text-xs font-semibold tracking-wide">Vault Grid</p>
            <span className="text-[10px] font-mono text-gray-400">
              {sortedFiles.length} file{sortedFiles.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4">
            {sortedFiles.length === 0 ? (
              <p className="text-xs text-gray-400 font-mono">
                No artifacts yet. Drop a file or wait for a peer to send one.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {sortedFiles.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() =>
                      isPreviewable(file) ? setPreviewFile(file) : undefined
                    }
                    className="group relative flex flex-col items-stretch rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="aspect-video w-full bg-black/60 flex items-center justify-center overflow-hidden">
                      {file.mimeType.startsWith('image/') ? (
                        <img
                          src={file.objectUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                        />
                      ) : file.mimeType.startsWith('video/') ? (
                        <video
                          src={file.objectUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <FileIcon className="text-gray-300" size={24} />
                      )}
                    </div>
                    <div className="px-3 py-2 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1 text-[11px] text-gray-200 font-mono truncate max-w-[80%]">
                          {renderFileIcon(file)}
                          <span className="truncate">{file.name}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {Math.round(file.size / 1024)} KB
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        from {file.fromPeerId.slice(0, 6)}…
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Dialog.Root
        open={previewFile !== null}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-md z-40" />
          <Dialog.Content className="fixed inset-4 sm:inset-10 md:inset-16 lg:inset-24 z-50 flex items-center justify-center">
            {previewFile && (
              <div className="glass-panel relative max-w-4xl w-full h-full rounded-2xl border border-white/20 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/60">
                  <div className="flex flex-col">
                    <Dialog.Title className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
                      {previewFile.name}
                    </Dialog.Title>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {previewFile.mimeType} ·{' '}
                      {Math.round(previewFile.size / 1024)} KB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={previewFile.objectUrl}
                      download={previewFile.name}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-mono bg-white/10 hover:bg-white/20 border border-white/20"
                    >
                      <Download size={12} />
                      Save
                    </a>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <X size={14} />
                      </button>
                    </Dialog.Close>
                  </div>
                </header>
                <div className="flex-1 min-h-0 bg-black/80 flex items-center justify-center p-2 sm:p-4">
                  {previewFile.mimeType.startsWith('image/') ? (
                    <img
                      src={previewFile.objectUrl}
                      alt={previewFile.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : previewFile.mimeType.startsWith('video/') ? (
                    <video
                      src={previewFile.objectUrl}
                      controls
                      className="max-h-full max-w-full"
                    />
                  ) : (
                    <p className="text-xs text-gray-300 font-mono">
                      No inline preview available for this file type.
                    </p>
                  )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

