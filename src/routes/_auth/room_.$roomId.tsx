import { ArrowRightCircle, Copy } from 'lucide-react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import QRCode from 'react-qr-code'
import superjson from 'superjson'
import toast from 'react-hot-toast'
import { useGameStore } from '@/store/useGameStore'
import { useAuthStore } from '@/store/useAuthStore'
import { API_URL, FRONTEND_URL } from '@/lib/config'
import { BingoSection } from '@/components/BingoSection'

type RoomParams = {
    code?: string
}

export const Route = createFileRoute('/_auth/room_/$roomId')({
    component: SpecificRoom,
    beforeLoad: () => { },
    loaderDeps: ({ search: { code } }: { search: RoomParams }) => ({ code }),
    loader: async ({ params, deps }) => {
        const { code } = deps
        const res = await fetch(`${API_URL}/api/room/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: params.roomId, code })
        })
        if (res.status == 404) throw redirect({ to: '/' })
        const { json, meta } = await res.json()
        const { roomId, players } = superjson.deserialize({ json, meta })
        console.log('check')
        const gameStore = useGameStore.getState()
        // gameStore.setPlayers(data.players)
        gameStore.setRoomData({ roomId, code })
        // gameStore.setAdmin()
        return { roomId, code }
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
    const { code, roomId, gameStatus, setGameStatus, setMyNumbers } = useGameStore()
    const joinLink = `${FRONTEND_URL}/room/join/${roomId}?code=${code}`






    const startGame = () => {
        console.log('start game')
        socket?.emit('game:start', { roomId })
    }

    const handleGameStarted = () => {
        socket?.on('game:started', ({ json, meta }) => {
            const { players: playersWithNumbers } = superjson.deserialize({ json, meta })
            console.log(playersWithNumbers)
            setGameStatus('started')
            const numbers = playersWithNumbers.get(useAuthStore.getState().authUser!.id).numbers
            setMyNumbers(numbers)
        })
    }
    useEffect(handleGameStarted, [socket])





    const copyJoinLink = () => {
        navigator.clipboard.writeText(joinLink)
        toast.success('Link copied to clipboard!',
            // { iconTheme: { primary: '#ff5d73', secondary: '#ffffff' } }
        )
    }
    if (roomId != roomIdParams) {
        return <p>error: wrong room id</p>
    }

    return (

        <main className='flex flex-1 justify-center items-center' >

            {gameStatus === 'waiting' &&
                <section id='room-details' className='w-full p-4'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='max-w-[200px] sm:max-w-[300px] mb-1 sm:mb-6 h-auto mx-0 my-auto w-full'>
                            <QRCode value={joinLink} viewBox={`0 0 256 256`} size={256} className='h-auto max-w-[100%] w-full' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 items-center justify-center' >
                            <b className='w-[100px]'>Join link:</b>
                            <div className='flex gap-2 w-auto items-center border-1 border-slate-200 rounded-lg p-2 hover:bg-slate-100 hover:cursor-pointer' onClick={copyJoinLink}>
                                <span className='text-sm w-full text-wrap break-all'>{joinLink}</span>
                                <span className='p-2'>
                                    <Copy size={12} strokeWidth={2} />
                                </span>
                            </div>
                        </div>
                        <button className='rounded-lg border-0 border-black bg-flabingo-400 text-white text-xs font-bold uppercase px-3 py-2 hover:bg-flabingo-200 hover:cursor-pointer' onClick={startGame}>start game</button>
                    </div>
                </section>
            }

            <BingoSection />
        </main >
    )
}


