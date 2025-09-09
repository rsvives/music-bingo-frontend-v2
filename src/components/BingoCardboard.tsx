import { BingoNumber } from "./BingoNumber"
import type { CSSProperties } from "react"

type props = {
    bingoNumbers: Array<Array<number>>
}

const table: CSSProperties = {
    maxWidth: 600,
    width: '100%',
    margin: 'auto'

}
export const BingoCardBoard = ({ bingoNumbers }: props) => {
    return (
        <table style={table} cellSpacing={0} cellPadding={12} border={1}>
            <tbody>

                {bingoNumbers.map((row, i) =>
                    <tr key={`row-${i}`}>
                        {row.map((number, j) => <BingoNumber number={number} row={i} col={j} />)}
                    </tr>
                )}
            </tbody>
        </table>
    )
}