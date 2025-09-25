
import { cn } from "@/lib/utils"
import socket from "@/socket/socket"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { useNumbersStore } from "@/store/useNumbersStore"

type props = {
    number: number,
    row: number,
    col: number
}

export const BingoNumber = ({ number, row, col }: props) => {
    const { authUser } = useAuthStore()
    const { setConfetti, lineWinner, gameStatus } = useGameStore()
    const { myMarkedNumbers, calledNumbers, addMarkedNumber, checkLine, checkBingo } = useNumbersStore()
    const markedNumberClass = myMarkedNumbers.has(number) ? 'bg-slate-300' : ''
    const classes = `w-[56px] p-4 text-center rounded-md border-1 border-slate-200  ${markedNumberClass}`

    const handleOnClick = () => {

        // if (number === lastCalledNumber) {
        // if (true) {
        if (calledNumbers.has(number)) {

            addMarkedNumber(number)
            if (checkLine()) {
                if (!lineWinner) {
                    setConfetti(true)
                    socket.emit('number:line', authUser)
                    return
                }
            }
            if (checkBingo()) {
                setConfetti(true)
                socket.emit('number:bingo', authUser)
                return
            }
            socket.emit('number:mark', myMarkedNumbers.size, number)
        }
    }

    return (
        <td className="p-1" itemID={`col-${row}- ${col} `}>
            <button onClick={handleOnClick} className={cn(classes, gameStatus === 'started' ? 'hover:bg-slate-100' : 'hover:bg-none')} disabled={gameStatus === 'paused'}>
                {number}
            </button>
        </td >
    )
}