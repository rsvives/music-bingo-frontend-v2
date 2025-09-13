
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Player, PlayersMap, User } from '@/types'

type State = {
    roomId: string | null,
    code: string | null,
    admin: User | null,
    isJoined: boolean
    players: PlayersMap | null
}
type Actions = {
    setRoomData: ({ roomId, code }: { roomId: string, code: string }) => void
    setAdmin: (admin: User) => void
    join: () => void
    leave: () => void
    setJoined: (state: boolean) => void,
    setPlayers: (players: PlayersMap) => void

    resetRoomStore: () => void,

}

export const useRoomStore = create<State & Actions>()(
    persist(
        (set, _, store) => ({
            roomId: null,
            code: null,
            admin: null,
            isJoined: false,
            players: null,

            setRoomData: ({ roomId, code }) => { set({ roomId, code }) },
            setAdmin: (admin) => { set({ admin: admin }) },
            join: () => {
                set({ isJoined: true })
            },
            leave: () => {
                set({ isJoined: false })
            },
            setJoined: (state) => { set({ isJoined: state }) },
            setPlayers: (players) => {
                console.log(players)
            },

            resetRoomStore: () => { set(store.getInitialState()) }
        }),
        {
            name: 'flabingo-room-storage', // name of the item in the storage (must be unique)
            // storage,
        }
    )
)