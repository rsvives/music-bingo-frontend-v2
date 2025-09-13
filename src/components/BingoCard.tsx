import { BingoNumber } from "./BingoNumber"

type props = {
    bingoNumbers: Array<Array<number>>
}

export const BingoCard = ({ bingoNumbers }: props) => {
    return (
        <table cellSpacing={0} cellPadding={0} border={0}>
            <tbody>

                {bingoNumbers.map((row, i) =>
                    <tr key={`row-${i}`}>
                        {row.map((number, j) => <BingoNumber key={`col-${i}-${j}`} number={number} row={i} col={j} />)}
                    </tr>
                )}
            </tbody>
        </table>
    )
}