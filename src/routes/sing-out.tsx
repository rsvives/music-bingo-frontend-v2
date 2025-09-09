import { createFileRoute } from '@tanstack/react-router'
// import { useEffect } from 'react'
// import { useAuthStore } from '@/store/useAuthStore'

export const Route = createFileRoute('/sing-out')({
    component: RouteComponent,
})

function RouteComponent() {
    // const { socket } = useAuthStore()
    // useEffect(() => {
    //     socket?.disconnect
    // }, [])

    return <div>Hello "/sing-out"!</div>
}
