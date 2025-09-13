// import type { PlayersMap } from "@/types"
import { useEffect } from "react"
import superjson from 'superjson'
import { JoinLeaveButton } from "./JoinLeaveButton"
import type { Player, PlayerId } from "@/types"
import type { SuperJSONValue } from "node_modules/superjson/dist/types"
import { useAuthStore } from "@/store/useAuthStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { useRoomStore } from "@/store/useRoomStore"


export const PlayerList = () => {
    const { socket, authUser } = useAuthStore()
    const { admin, } = useRoomStore()
    const { players,

        setPlayers,
        removePlayer } = usePlayersStore()


    useEffect(() => {
        const onRoomJoined = ({ json, meta }: SuperJSONValue) => {
            const data: { players: Map<PlayerId, Player>, lastJoinedPlayer: Player } = superjson.deserialize({ json, meta })
            console.log('joined', data)
            const { players: receivedPlayers, lastJoinedPlayer } = data
            setPlayers(receivedPlayers)
            usePlayersStore.getState().setCurrentPlayer(authUser!.id)
        }

        const onRoomLeaved = (playerId: string) => {
            console.log('leaved', playerId)
            removePlayer(playerId)
        }

        socket?.on('room:joined', onRoomJoined)
        socket?.on('room:leaved', onRoomLeaved)

        console.log('players', players)
        return () => {
            socket?.off('room:joined', onRoomJoined)
            socket?.off('room:leaved', onRoomLeaved)
        }
    }, [socket])

    if (players.size === 0) {
        return (<div>Loading players...</div>)

    } else {

        return (
            <section className="flex flex-col gap-2 border-b-1 border-b-slate-200 p-2 sm:border-b-0">
                <div className="flex sm:justify-between gap-2 items-baseline">
                    <h2 className="font-bold text-md">Players</h2>
                    <span className="font-medium text-sm text-slate-600">{players.size}/6</span>
                </div>
                <ul className="flex flex-row sm:flex-col flex-wrap sm:flex-no-wrap gap-1">
                    {[...players].map(([k, p]) => (
                        <PlayerCard key={k} player={p} />
                    ))}
                </ul>
                {!(authUser?.id === admin?.id) && <JoinLeaveButton />}
            </section>
        )
    }

}

const PlayerCard = ({ player }: { player: Player }) => {

    const progress = player.score ? `${player.score / 15 * 100}` : 0

    console.log('progress', progress)
    return (
        <li className=" w-fit sm:w-full gap-4  border-slate-200 border-1 rounded-lg overflow-hidden">
            <div className="flex gap-4 justify-between items-center p-1.5">
                <p className="flex gap-2 items-center">
                    <img src={player.pic} alt={`${player.firstName} profile pic`} className="w-[24px] rounded-full aspect-square" />
                    {player.firstName}
                </p>
                {player.isAdmin && <span className="text-[9px] sm:text-xs font-bold px-2 py-1 rounded-full bg-slate-300 text-slate-700">admin</span>}
            </div>
            <div className={'h-[2px] bg-slate-400'} style={{ width: progress + '%' }}></div>
        </li>
    )

}