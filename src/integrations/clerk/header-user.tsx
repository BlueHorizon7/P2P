import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { PUBLISHABLE_KEY } from './provider'

export default function HeaderUser() {
  if (!PUBLISHABLE_KEY) {
    return <span className="text-xs text-red-400 border border-red-400 rounded px-2 py-1">Clerk Not Configured</span>
  }

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  )
}
