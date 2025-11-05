import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useNumbersStore } from '@/store/useNumbersStore'

export const DebugFooter = () => {
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