
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"

type props = {
    number: number,
    row: number,
    col: number
}

export const BingoNumber = ({ number, row, col }: props) => {
    const { authUser, socket } = useAuthStore()
    const { setConfetti, players, setBingoWinner, setLineWinner, myNumbers, lastNumber, myMarkedNumbers, lineWinner, addToMyMarkedNumbers } = useGameStore()
    // const lastNumberClass = number === lastNumber && false ? 'bg-flabingo-300!' : ''
    const markedNumberClass = myMarkedNumbers.has(number) ? 'bg-slate-300' : ''
    const classes = `w-[56px] p-4 text-center rounded-md border-1 border-slate-200 hover:bg-slate-100 ${markedNumberClass}`

    const handleOnClick = () => {
        console.log('clicked', number)
        if (number === lastNumber) {
            // if (true) {
            addToMyMarkedNumbers(number)
            if (checkLine()) {
                if (!lineWinner) {
                    setConfetti(true)
                    setLineWinner(players![authUser!.id])
                    socket?.emit('game:line', authUser)
                    toast(`${authUser?.firstName} won the line!`, { icon: '🎉' })
                }
            }
            if (checkBingo()) {
                setConfetti(true)
                setBingoWinner(players![authUser!.id])
                socket?.emit('game:bingo', authUser)
                toast(`${authUser?.firstName} made Bingo!`, { icon: '🎉' })
            }
        }

    }

    const checkLine = () => {
        return myNumbers.some((cardRow) => cardRow.every(n => myMarkedNumbers.has(n)))
    }

    const checkBingo = () => myNumbers.every((cardRow) => cardRow.every(n => myMarkedNumbers.has(n)))
    return (
        <td className="p-1" key={`col-${row}- ${col} `}>
            <button onClick={handleOnClick} className={classes}>
                {number}
            </button>
        </td >
    )
}