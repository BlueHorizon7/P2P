import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'
import { PUBLISHABLE_KEY } from '@/integrations/clerk/provider'

export const Route = createFileRoute('/demo/clerk')({
  component: App,
})

function App() {
  if (!PUBLISHABLE_KEY) {
    return <div className="p-4 text-red-500">Clerk is not configured. Please add VITE_CLERK_PUBLISHABLE_KEY to .env.local</div>
  }

  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>
  }

  if (!isSignedIn) {
    return <div className="p-4">Sign in to view this page</div>
  }

  return <div className="p-4">Hello {user.firstName}!</div>
}
