
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { checkBingo, checkLine } from "@/lib/utils"

type props = {
    number: number,
    row: number,
    col: number
}

export const BingoNumber = ({ number, row, col }: props) => {
    const { authUser, socket } = useAuthStore()
    const { setConfetti, lastNumber, myMarkedNumbers, lineWinner, addToMyMarkedNumbers } = useGameStore()
    const markedNumberClass = myMarkedNumbers.has(number) ? 'bg-slate-300' : ''
    const classes = `w-[56px] p-4 text-center rounded-md border-1 border-slate-200 hover:bg-slate-100 ${markedNumberClass}`

    const handleOnClick = () => {

        if (number === lastNumber) {
            // if (true) {

            addToMyMarkedNumbers(number)
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
        <td className="p-1" key={`col-${row}- ${col} `}>
            <button onClick={handleOnClick} className={classes}>
                {number}
            </button>
        </td >
    )
}