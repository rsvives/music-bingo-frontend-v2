import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoaderCircle } from 'lucide-react'
import superjson from 'superjson'
import type { Player, PlayerId } from '@/types'
import { useGameStore } from '@/store/useGameStore'
import { API_URL } from '@/lib/config'

import { BingoSection } from '@/components/BingoSection'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useRoomStore } from '@/store/useRoomStore'
import { useNumbersStore } from '@/store/useNumbersStore'




type RoomParams = {
    code?: string
}

export const Route = createFileRoute('/_auth/room_/join/$roomId')({
    component: LobbyRoom,
    beforeLoad: () => {
        useNumbersStore.getState().resetNumbersStore()
        useRoomStore.getState().resetRoomStore()
        usePlayersStore.getState().resetScores()
        usePlayersStore.getState().resetPlayers()
    },
    loaderDeps: ({ search: { code } }: { search: RoomParams }) => ({ code }),
    loader: async ({ params, deps }) => {
        const { code } = deps
        console.log('hello', deps)
        const res = await fetch(`${API_URL}/api/room/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: params.roomId, code })
        })
        if (res.status == 404) throw redirect({ to: '/', search: { error: 'room not found' } })
        if (res.status == 301) throw redirect({ to: '/', search: { error: 'forbidden' } })

        const { json, meta } = await res.json()
        const data: { admin: Player, players: Map<PlayerId, Player>, roomId: string, code: string } = superjson.deserialize({ json, meta })
        console.log('check', data)

        // TODO: check game status 
        usePlayersStore.getState().setPlayers(data.players)
        useRoomStore.getState().setAdmin(data.admin)
        useRoomStore.getState().setRoomData({ roomId: data.roomId, code: data.code })
        // useNumbersStore.getState().setCalledNumbers()
        // useNumbersStore.getState().setMyBingoNumbers()

        return data
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
