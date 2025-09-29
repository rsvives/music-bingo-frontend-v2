import { Copy } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import QRCode from 'react-qr-code'
import toast from 'react-hot-toast'
import { useGameStore } from '@/store/useGameStore'
import { FRONTEND_URL } from '@/lib/config'
import { BingoSection } from '@/components/BingoSection'
import { useRoomStore } from '@/store/useRoomStore'
import { GameControls } from '@/components/GameControls'
import socket from '@/socket/socket'
import { checkRoomAdmin } from '@/lib/utils'

type RoomParams = {
    code?: string
}

export const Route = createFileRoute('/_auth/room_/$roomId')({
    component: SpecificRoom,
    loaderDeps: ({ search: { code } }: { search: RoomParams }) => ({ code }),
    loader: ({ params, deps }) => checkRoomAdmin({ code: deps.code, roomId: params.roomId }),
    validateSearch: (search): RoomParams => {
        return {
            code: search.code as string || ''
        }
    }
})

function SpecificRoom() {
    const { roomId: roomIdParams } = Route.useParams()
    const { gameStatus } = useGameStore()
    const { roomId, code } = useRoomStore()
    const joinLink = `${FRONTEND_URL}/room/join/${roomId}?code=${code}`

    const startGame = () => {
        console.log('start game')
        socket.emit('game:start', { roomId })
    }

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

        <main className='flex flex-col gap-4 flex-1 justify-center items-center' >

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
            <GameControls />
        </main >
    )
}


