import { LoaderCircle } from "lucide-react"
import { AdminCrownIcon } from "./ui/AdminCrownIcon"
import type { Player } from "@/types"
import { cn } from "@/lib/utils"

type Props = {
    player: Player,
    showProgress?: boolean,
    showIsAdmin?: boolean
}

export const PlayerCard = ({ player, showProgress = true, showIsAdmin = true }: Props) => {
    const progress = player.score ? `${player.score / 15 * 100}` : 0

    console.log('progress', progress)
    return (
        <div className={cn(" sm:w-full gap-4  border-slate-200 border-1 rounded-lg overflow-hidden", { 'bg-slate-300 text-slate-500': !player.connected })}>
            <div className="flex gap-1 justify-between items-center p-1.5">
                <div className="flex gap-2 items-center  min-w-[24px]">
                    <img src={player.pic} alt={`${player.firstName} profile pic`} className="w-[24px] min-w-[24px] rounded-full aspect-square basis-6" />
                    <p className="text-ellipsis whitespace-nowrap overflow-hidden">{player.firstName}</p>
                </div>
                {!player.connected && <LoaderCircle className='animate-spin' />}
                {showIsAdmin && player.isAdmin && <span className="p-1 rounded-full border-1 border-slate-100 text-slate-700 basis-2" title="admin"><AdminCrownIcon size={14} color="var(--color-amber-400)" /></span>}
            </div>
            {
                showProgress && <div className={'h-[2px] bg-slate-400'} style={{ width: progress + '%' }}></div>
            }
        </ div>
    )

}