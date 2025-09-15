import { AdminCrownIcon } from "./ui/AdminCrownIcon"
import type { Player } from "@/types"

type Props = {
    player: Player,
    showProgress?: boolean,
    showIsAdmin?: boolean
}

export const PlayerCard = ({ player, showProgress = true, showIsAdmin = true }: Props) => {
    const progress = player.score ? `${player.score / 15 * 100}` : 0

    console.log('progress', progress)
    return (
        <div className=" sm:w-full gap-4  border-slate-200 border-1 rounded-lg overflow-hidden">
            <div className="flex gap-4 justify-between items-center p-1.5">
                <p className="flex gap-2 items-center text-ellipsis ">
                    <img src={player.pic} alt={`${player.firstName} profile pic`} className="w-[24px] rounded-full aspect-square" />
                    {player.firstName}
                </p>
                {showIsAdmin && player.isAdmin && <span className="text-[9px] sm:text-xs font-bold p-1 rounded-full border-1 border-slate-100 text-slate-700" title="admin"><AdminCrownIcon size={14} color="var(--color-amber-400)" /></span>}
            </div>
            {
                showProgress && <div className={'h-[2px] bg-slate-400'} style={{ width: progress + '%' }}></div>
            }
        </ div>
    )

}