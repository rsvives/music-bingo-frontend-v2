import type { ReactElement } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactElement | string,
    fill: 'solid' | 'outline' | 'ghost',
    color: 'primary' | 'secondary',
}
export const Button = ({ children, fill, color, className, ...rest }: ButtonProps) => {




    return (
        <button className={cn("flex gap-2 items-center rounded-lg px-3 py-2 text-xs font-bold uppercase hover:cursor-pointer",
            className,
            {
                "border-2 border-flabingo-400 bg-flabingo-400 text-white hover:bg-flabingo-300": color === 'primary' && fill === 'solid',
                "border-2 border-flabingo-400 text-flabingo-400 hover:bg-flabingo-200": color === 'primary' && fill === 'outline',
                "bg-slate-800 text-white hover:bg-slate-600": color === 'secondary' && fill === 'solid',
                "border-2 border-slate-800 text-slate-800 hover:bg-slate-400": color === 'secondary' && fill === 'outline',
            }
        )}
            {...rest}>
            {children}
        </button>
    )
}