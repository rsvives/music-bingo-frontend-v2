import { Button } from "./ui/Button"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"

export const JoinLeaveButton = () => {
    const { socket, authUser } = useAuthStore()
    const { roomId, code, isJoined, gameStatus, setJoined } = useGameStore()

    const handleJoin = () => {
        console.log('joining')
        if (socket && !isJoined && gameStatus === 'waiting') {
            socket.emit('room:join', { room: roomId, code, user: authUser })
            setJoined(true)
        }
        if (socket && isJoined) {
            socket.emit('room:leave', { room: roomId, code, user: authUser })
            setJoined(false)
        }
    }

    const text = isJoined ? 'leave' : 'join'
    return (
        <Button fill="solid" color="secondary" className="min-w-[100px] text-center justify-center" onClick={handleJoin} >{text}</Button>

    )
}