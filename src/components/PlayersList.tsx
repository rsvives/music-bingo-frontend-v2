// import type { PlayersMap } from "@/types"
import { useEffect } from "react"
import type { Player } from "@/types"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"

export const PlayerList = () => {
    const { socket } = useAuthStore()
    const { players, addPlayer } = useGameStore()

    const newPlayerJoined = () => {
        socket?.on('room:joined', (data) => {
            console.log('joined', data)
            const { lastPlayerJoined } = data
            addPlayer(lastPlayerJoined)
        })

    }

    // console.log(Object.entries(players.entries()))

    useEffect(newPlayerJoined, [socket])

    if (!players || Object.keys(players).length === 0) {
        return (<div>Loading players...</div>)

    } else {

        return (
            <section className="flex flex-col gap-2">
                <div className="flex sm:justify-between gap-2 items-baseline">
                    <h2 className="font-bold text-md">Players</h2>
                    <span className="font-medium text-sm text-slate-600">{Object.keys(players).length}/6</span>
                </div>
                <ul className="flex flex-row sm:flex-col flex-wrap sm:flex-no-wrap gap-1">
                    {Object.entries(players).map(([k, p]: [string, Player]) => (
                        <li key={k} className="flex w-fit sm:w-full gap-4 items-center justify-between border-slate-200 border-1 p-1.5 rounded-lg">
                            <p className="flex gap-2 items-center">
                                <img src={p.pic} alt={`${p.firstName} profile pic`} className="w-[24px] rounded-full aspect-square" />
                                {p.firstName}
                            </p>
                            {p.isAdmin && <span className="text-[9px] sm:text-xs font-bold px-2 py-1 rounded-full bg-slate-300 text-slate-700">admin</span>}
                        </li>
                    ))}
                </ul>
            </section>
        )
    }

}