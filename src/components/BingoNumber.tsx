
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { useNumbersStore } from "@/store/useNumbersStore"

type props = {
    number: number,
    row: number,
    col: number
}

export const BingoNumber = ({ number, row, col }: props) => {
    const { authUser, socket } = useAuthStore()
    const { setConfetti, lineWinner, } = useGameStore()
    const { lastCalledNumber, myMarkedNumbers, addMarkedNumber, checkLine, checkBingo } = useNumbersStore()
    const markedNumberClass = myMarkedNumbers.has(number) ? 'bg-slate-300' : ''
    const classes = `w-[56px] p-4 text-center rounded-md border-1 border-slate-200 hover:bg-slate-100 ${markedNumberClass}`

    const handleOnClick = () => {

        if (number === lastCalledNumber) {
            // if (true) {

            addMarkedNumber(number)
            if (checkLine()) {
                if (!lineWinner) {
                    setConfetti(true)
                    socket?.emit('game:line', authUser)
                    return
                }
            }
            if (checkBingo()) {
                setConfetti(true)
                socket?.emit('game:bingo', authUser)
                return
            }
            socket?.emit('game:mark-number')
        }
    }

    return (
        <td className="p-1" itemID={`col-${row}- ${col} `}>
            <button onClick={handleOnClick} className={classes}>
                {number}
            </button>
        </td >
    )
}