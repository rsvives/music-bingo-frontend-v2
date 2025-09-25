import { JoinLeaveButton } from "./JoinLeaveButton"
import { PlayerCard } from "./PlayerCard"
import { useAuthStore } from "@/store/useAuthStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { useRoomStore } from "@/store/useRoomStore"


export const PlayerList = () => {
    const { authUser } = useAuthStore()
    const { admin, } = useRoomStore()
    const { players } = usePlayersStore()


    if (players.size === 0) {
        return (<div>Loading players...</div>)

    } else {

        return (
            <section className="flex flex-col gap-2 border-b-1 border-b-slate-200 p-2 sm:border-b-0">
                <div className="flex sm:justify-between gap-2 items-baseline">
                    <h2 className="font-bold text-md">Players</h2>
                    <span className="font-medium text-sm text-slate-600">{players.size}</span>
                </div>
                <ul className="grid grid-cols-3 sm:flex  sm:flex-col  sm:flex-no-wrap gap-1">
                    {[...players].map(([k, p]) => (
                        <li key={k}>
                            <PlayerCard player={p} />
                        </li>
                    ))}
                </ul>
                {!(authUser?.id === admin?.id) && <JoinLeaveButton />}
            </section>
        )
    }

}

