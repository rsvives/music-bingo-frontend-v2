import { Button } from "./ui/Button"
import socket from "@/socket/socket"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { useRoomStore } from "@/store/useRoomStore"

export const JoinLeaveButton = () => {
    const { authUser } = useAuthStore()
    const { roomId, code } = useRoomStore()
    const { players, setConnectionStatus } = usePlayersStore()
    const { gameStatus } = useGameStore()

    const handleJoin = () => {
        console.log('joining')
        if (authUser) {
            console.log(players, authUser.id)
            if (!players.get(authUser.id)?.connected) {
                socket.emit('room:join', { room: roomId, code, user: authUser })
                setConnectionStatus(authUser.id, true)
            }
            if (players.get(authUser.id)?.connected) {
                socket.emit('room:leave', { room: roomId, code, user: authUser })
                setConnectionStatus(authUser.id, false)
            }

        }
    }

    const text = !players.get(authUser!.id)?.connected ? 'join' : 'leave'
    const fill = !players.get(authUser!.id)?.connected ? 'solid' : 'outline'
    return (
        <>
            {gameStatus === 'waiting'
                && <Button fill={fill} color="secondary" className="min-w-[100px] text-center justify-center" onClick={handleJoin}>{text}</Button>}

        </>
    )
}