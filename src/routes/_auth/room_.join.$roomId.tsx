import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useGameStore } from '@/store/useGameStore'
import { API_URL } from '@/utils/config'
import { BingoCardBoard } from '@/components/BingoCardboard'



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

    const { code } = Route.useSearch()
    const { roomId } = Route.useParams()
    const { socket, authUser } = useAuthStore()
    const { players, addPlayer, gameStatus, setGameStatus, setJoined, isJoined, myNumbers, setMyNumbers, setLastNumber, addToMarkedNumbers, lastNumber } = useGameStore()

    const roomDetails = Route.useLoaderData()
    console.log(roomDetails)


    const handleJoin = () => {
        console.log('joining')
        if (socket && !isJoined && gameStatus === 'waiting') {
            socket.emit('room:join', { room: roomId, code, user: authUser })
        }
    }

    const joinedToRoom = () => {
        console.log('joinedtoroom')
        if (socket) {
            socket.on('room:joined', (data) => {
                const { lastPlayerJoined } = data
                addPlayer(lastPlayerJoined)
                setJoined(true)
            })

        }
    }

    useEffect(joinedToRoom, [socket])

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
            addToMarkedNumbers(randomNumber)

        })
    }
    useEffect(handleNumberGenerated, [socket])

    return <div>
        {!isJoined && gameStatus === 'waiting' &&
            <div>
                <h1>Room: <code>{roomId}</code></h1>
                <p>code: <code>{code}</code> </p>
                <button onClick={handleJoin}>Join!</button>
            </div>
        }

        <div>
            <h2>Players:</h2>
            <ul>
                {Object.entries(players).map(([k, p]) => (
                    <li key={k}>{p.firstName}
                        {p.isAdmin && <span>✅</span>}
                    </li>
                ))}
            </ul>
        </div>
        <div>
            {gameStatus === 'waiting' && <h2>Waiting to start</h2>}
        </div>
        <h2 style={{ fontSize: 24 }}>{lastNumber}</h2>
        <div>
            <h2>My bingo card:</h2>
            <BingoCardBoard bingoNumbers={myNumbers} />
        </div>
    </div >
}
