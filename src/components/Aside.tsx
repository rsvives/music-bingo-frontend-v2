import { useEffect } from "react"
import { PlayerList } from "./PlayersList"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"

export const Aside = () => {
    const { socket, authUser } = useAuthStore()
    const { admin, addPlayer, setJoined } = useGameStore()



    const joinedToRoom = () => {
        console.log('joinedtoroom')
        if (socket) {
            socket.on('room:joined', (data) => {
                console.log('room:joined', data)
                const { lastPlayerJoined } = data
                addPlayer(lastPlayerJoined)
                setJoined(true)
            })

        }
    }

    useEffect(joinedToRoom, [socket])

    if (admin === null || authUser === null) return <div>Loading...</div>

    // const isAdmin = authUser.id === admin.id ? true : false

    return (
        <>
            <aside className='p-2 flex flex-col gap-4 sm:max-w-[280px] w-full'>
                {/* <div className='flex gap-2 justify-between items-end p-2 rounded-lg border-1 border-slate-200'>
                <div>
                        <h1><b>Room:</b> <code>{roomId}</code></h1>
                        <p><b>Code:</b> <code>{code}</code> </p>
                    </div>
                {gameStatus === 'waiting' && !isAdmin &&
                        <JoinLeaveButton isJoined={isJoined} handleJoin={handleJoin} />
                    }
                </div> */}
                <PlayerList />
            </aside>
        </>
    )
}

