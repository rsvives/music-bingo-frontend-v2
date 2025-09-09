import type { CSSProperties } from "react"
import { useGameStore } from "@/store/useGameStore"

type props = {
    number: number,
    row: number,
    col: number
}
const style: CSSProperties = {
    padding: 12,
    textAlign: 'center'

}

export const BingoNumber = ({ number, row, col }: props) => {
    const { lastNumber, markedNumbers } = useGameStore()
    const lastNumberClass = number === lastNumber ? 'last-number' : ''
    const markedNumberClass = markedNumbers.has(number) ? 'marked' : ''
    return (
        <td style={style} className={`${markedNumberClass} ${lastNumberClass}`} key={`col-${row}- ${col} `}> {number}</td >
    )
}