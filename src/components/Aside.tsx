import { useEffect } from "react"
import { PlayerList } from "./PlayersList"
import { JoinLeaveButton } from "./JoinLeaveButton"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"

export const Aside = () => {

    // if (admin === null || authUser === null) return <div>Loading...</div>

    return (
        <>
            <aside className='p-2 flex flex-col gap-4 sm:max-w-[280px] w-full'>
                {/* <RoomDetails /> */}
                <PlayerList />
            </aside>
        </>
    )
}

const RoomDetails = () => {
    const { authUser } = useAuthStore()
    const { roomId, code, gameStatus, admin } = useGameStore()
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