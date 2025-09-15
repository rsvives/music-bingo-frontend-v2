import { BingoNumber } from "./BingoNumber"
import type { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"

type props = {
    bingoNumbers: Array<Array<number>>
    className: ClassNameValue
}

export const BingoCard = ({ bingoNumbers, className }: props) => {

    return (
        <table cellSpacing={0} cellPadding={0} border={0} className={cn('rounded-md', className)}>
            <tbody>

                {
                    bingoNumbers.map((row, i) =>
                        <tr key={`row-${i}`}>
                            {row.map((number, j) => <BingoNumber key={`col-${i}-${j}`} number={number} row={i} col={j} />)}
                        </tr>
                    )
                }
            </tbody >
        </table >
    )
}