import { Copy } from 'lucide-react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import QRCode from 'react-qr-code'
import { useGameStore } from '@/store/useGameStore'
import { useAuthStore } from '@/store/useAuthStore'
import { API_URL, FRONTEND_URL } from '@/utils/config'
import { BingoCardBoard } from '@/components/BingoCardboard'


type RoomParams = {
    code?: string
}

export const Route = createFileRoute('/_auth/room_/$roomId')({
    component: SpecificRoom,
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

function SpecificRoom() {

    const { roomId: roomIdParams } = Route.useParams()
    const { socket } = useAuthStore()
    const { players, code, roomId, addPlayer, gameStatus, setGameStatus, myNumbers, setMyNumbers, markedNumbers, setLastNumber, addToMarkedNumbers, lastNumber } = useGameStore()
    const joinLink = `${FRONTEND_URL}/room/join/${roomId}?code=${code}`

    const newPlayerJoined = () => {
        socket?.on('room:joined', (data) => {
            console.log('joined', data)
            const { lastPlayerJoined } = data
            addPlayer(lastPlayerJoined)
        })

    }
    const copyJoinLink = () => {
        navigator.clipboard.writeText(joinLink)
        alert('Link copied')
    }
    useEffect(newPlayerJoined, [socket])




    const startGame = () => {
        console.log('start game')
        socket?.emit('game:start', { roomId })
    }

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


    const handleNextNumber = () => {
        console.log('next number')
        socket?.emit('game:next-number', ({ markedNumbers: [...markedNumbers], roomId }))
    }
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


    if (roomId != roomIdParams) {
        return <p>error: wrong room id</p>
    }

    return (
        <div>
            {gameStatus === 'waiting' && <div>

                <h1>Room: <code>{roomId}</code></h1>
                <p>code: <code>{code}</code> </p>
                <button onClick={startGame}>start!</button>
                <div>
                    <p>Join link:</p>
                    <p>{joinLink} <button onClick={copyJoinLink}><Copy /></button> </p>
                    <QRCode value={joinLink} />
                </div>
            </div>}

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
            <h2 style={{ fontSize: 24 }}>{lastNumber}</h2>
            <div>
                <h2>My bingo card:</h2>
                <button onClick={handleNextNumber}>next number</button>
                <BingoCardBoard bingoNumbers={myNumbers} />
            </div>
        </div >
    )
}
