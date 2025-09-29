import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Aside } from '@/components/Aside'
import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useNumbersStore } from '@/store/useNumbersStore'

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
            {/* <DebugFooter /> */}
        </div>

    )
}

const DebugFooter = () => {
    const { gameStatus, } = useGameStore()
    const { admin, code, roomId, isJoined } = useRoomStore()
    const { myBingoNumbers, myMarkedNumbers, lastCalledNumber } = useNumbersStore()
    const { currentPlayer, players } = usePlayersStore()
    return (
        <footer className='fixed bottom-0 bg-slate-800 text-white rounded-md p-2 w-[100%]'>
            <p>
                {JSON.stringify({ game: gameStatus })}
            </p>
            <p>{JSON.stringify({ room: { admin, code, roomId, isJoined } })}</p>
            <p>{JSON.stringify({ numbers: { myBingoNumbers, myMarkedNumbers: [...myMarkedNumbers], lastCalledNumber } })}</p>
            <p>{JSON.stringify({ roomPlayers: currentPlayer, players: [...players] })}</p>
        </footer>
    )

}