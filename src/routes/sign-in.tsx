import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'

export const Route = createFileRoute('/sign-in')({
    component: SignInPage

})

function SignInPage() {
    // @ts-ignore: next line redirect property
    const { redirect } = Route.useSearch()
    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignIn redirectUrl={redirect} signUpUrl="/sign-up" />
        </div>
    )
}