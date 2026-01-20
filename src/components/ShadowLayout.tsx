import { AuroraBackground } from './AuroraBackground'
import { Sidebar } from './Sidebar'

export const ShadowLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden font-sans text-white select-none">
      <AuroraBackground />
      <Sidebar />
      <main className="flex-1 relative pt-12 md:pt-0 p-4 sm:p-6 overflow-y-auto flex flex-col">
        {children}
      </main>
    </div>
  )
}
