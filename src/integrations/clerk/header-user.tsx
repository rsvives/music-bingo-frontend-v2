import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'

export default function HeaderUser() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <div className='py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-700 hover:cursor-pointer'>
            Sign In
          </div>
        </SignInButton>
      </SignedOut>
    </>
  )
}
