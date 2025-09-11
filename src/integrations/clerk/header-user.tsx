import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { Button } from '@/components/ui/Button'

export default function HeaderUser() {

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button color='secondary' fill='solid'>

            Sign In
          </Button>

        </SignInButton>
      </SignedOut >
    </>
  )
}
