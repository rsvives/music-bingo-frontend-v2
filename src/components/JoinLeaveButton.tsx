import { Button } from "./ui/Button"
import socket from "@/socket/socket"
import { useAuthStore } from "@/store/useAuthStore"
import { useRoomStore } from "@/store/useRoomStore"

export const JoinLeaveButton = () => {
    const { authUser } = useAuthStore()
    const { roomId, code, isJoined, setJoined } = useRoomStore()

    const handleJoin = () => {
        console.log('joining')
        if (!isJoined) {
            socket.emit('room:join', { room: roomId, code, user: authUser })
            setJoined(true)
        }
        if (isJoined) {
            socket.emit('room:leave', { room: roomId, code, user: authUser })
            setJoined(false)
        }
    }

    const text = isJoined ? 'leave' : 'join'
    return (
        <Button fill="solid" color="secondary" className="min-w-[100px] text-center justify-center" onClick={handleJoin} >{text}</Button>

    )
}