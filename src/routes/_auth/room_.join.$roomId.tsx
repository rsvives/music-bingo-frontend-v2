import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useGameStore } from '@/store/useGameStore'
import { API_URL } from '@/lib/config'

import { BingoSection } from '@/components/BingoSection'
import { JoinLeaveButton } from '@/components/JoinLeaveButton'



type RoomParams = {
    code?: string
}

export const Route = createFileRoute('/_auth/room_/join/$roomId')({
    component: LobbyRoom,
    // beforeLoad,
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
        if (res.status == 404) throw redirect({ to: '/' })
        const data = await res.json()
        console.log('check', data)
        const gameStore = useGameStore.getState()
        gameStore.setPlayers(data.players)
        gameStore.setAdmin(data.admin)
        gameStore.setRoomData({ roomId: data.roomId, code: data.code })
        return data
    },
    validateSearch: (search): RoomParams => {
        return {
            code: search.code as string || ''
        }
    }
})

function LobbyRoom() {

    const { socket, authUser } = useAuthStore()
    const { roomId, code, gameStatus, isJoined, setGameStatus, setMyNumbers, setLastNumber } = useGameStore()

    const handleGameStarted = () => {
        socket?.on('game:started', (data) => {
            console.log('game started', data)
            setGameStatus('started')
            const { players: allPlayers } = data
            const numbers = allPlayers[useAuthStore.getState().authUser!.id].numbers
            setMyNumbers(numbers)
        })
    }
    useEffect(handleGameStarted, [socket])

    const handleNumberGenerated = () => {
        console.log('number generated')
        socket?.on('game:number-generated', (data) => {
            console.log(data)
            const { randomNumber } = data
            setLastNumber(randomNumber)
            // addToMarkedNumbers(randomNumber)

        })
    }
    useEffect(handleNumberGenerated, [socket])

    const handleJoin = () => {
        console.log('joining')
        if (socket && !isJoined && gameStatus === 'waiting') {
            socket.emit('room:join', { room: roomId, code, user: authUser })
        }
        if (socket && isJoined && gameStatus === 'started') {
            socket.emit('room:leave', { room: roomId, code, user: authUser })
        }
    }

    return (
        <div className='flex flex-1 items-center justify-center'>
            {!isJoined && <JoinLeaveButton isJoined={isJoined} handleJoin={handleJoin} />}
            {gameStatus === 'waiting' && isJoined && <h2 className='animate-pulse flex gap-2'><LoaderCircle className='animate-spin' /> Waiting to start</h2>}

            <BingoSection />
        </div >
    )
}
