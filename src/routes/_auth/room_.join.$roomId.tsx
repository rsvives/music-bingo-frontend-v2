import { createFileRoute } from '@tanstack/react-router'

import { LoaderCircle } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'


import { BingoSection } from '@/components/BingoSection'
import { useRoomStore } from '@/store/useRoomStore'
import { checkRoomCode } from '@/lib/utils'




type RoomParams = {
    code?: string
}

export const Route = createFileRoute('/_auth/room_/join/$roomId')({
    component: LobbyRoom,
    loaderDeps: ({ search: { code } }: { search: RoomParams }) => ({ code }),
    loader: async ({ params, deps }) => {
        await checkRoomCode({ code: deps.code, roomId: params.roomId })
    },
    validateSearch: (search): RoomParams => {
        return {
            code: search.code as string || ''
        }
    }
})

function LobbyRoom() {


    const { gameStatus } = useGameStore()
    const { isJoined } = useRoomStore()




    return (
        <div className='flex flex-1 items-center justify-center'>
            {gameStatus === 'waiting' && isJoined && <h2 className='animate-pulse flex gap-2'><LoaderCircle className='animate-spin' /> Waiting to start</h2>}
            <BingoSection />
        </div >
    )
}
