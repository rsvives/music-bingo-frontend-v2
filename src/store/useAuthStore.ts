import { create } from 'zustand'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client';
import type { User } from '@/types'
import type { UserResource } from '@clerk/types'
import { API_URL } from '@/lib/config';
// import { socket } from '@/socket'



type State = {
    authUser: User | null
    socket: Socket | null
}
type Actions = {
    connectSocket: () => void,
    disconnectSocket: () => void,
    checkAuth: (user: UserResource) => void
}
export const useAuthStore = create<State & Actions>((set, get) => ({
    socket: null,
    authUser: null,

    checkAuth: (user?) => {
        if (user) {

            const mappedUser: User = {
                id: user.id,
                username: user.username || user.firstName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.primaryEmailAddress?.emailAddress,
                pic: user.imageUrl || '/user-default-avatar.png'
            }
            set({ authUser: mappedUser })
            if (!get().socket?.connected) get().connectSocket()
        }

    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return
        console.log('auth store socket')

        const socket = io(API_URL, { autoConnect: false })

        socket.connect()
        // set({ socket: socket })
        socket.on('connect', () => set({ socket: socket }))
        socket.on('disconnect', () => get().disconnectSocket())

    },
    disconnectSocket: () => {
        // if (get().socket?.connected) {

        get().socket?.off('disconnect', () => set({ socket: null }))
        get().socket?.disconnect()
        // }
    },
}))