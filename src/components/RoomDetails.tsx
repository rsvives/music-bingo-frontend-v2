import { JoinLeaveButton } from "./JoinLeaveButton"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { useRoomStore } from "@/store/useRoomStore"

export const RoomDetails = () => {
    const { authUser } = useAuthStore()
    const { gameStatus, } = useGameStore()
    const { roomId, code, admin } = useRoomStore()

    const isAdmin = authUser?.id === admin?.id
    return (
        <div className='flex gap-2 justify-between items-end p-2 rounded-lg border-1 border-slate-200'>
            <div>
                <h1><b>Room:</b> <code>{roomId}</code></h1>
                <p><b>Code:</b> <code>{code}</code> </p>
            </div>
            {gameStatus === 'waiting' && !isAdmin &&
                <JoinLeaveButton />
            }
        </div>
    )
}