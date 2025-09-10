import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Aside } from '@/components/Aside'

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/sign-in',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: () => <AuthRoute />,
})

const AuthRoute = () => {
    return (
        <div className='flex min-h-[80vh] flex-col sm:flex-row'>
            <Aside />
            <Outlet />
        </div>

    )
}