import { create } from 'zustand'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast';
import type { Socket } from 'socket.io-client';
import type { User } from '@/types'
import type { UserResource } from '@clerk/types'
import { API_URL } from '@/lib/config';
import { handleGameEnded, handleGamePaused, handleGameRestarted, handleGameResumed } from '@/socket/listeners';
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
            // if (sessionID) {
            //     socket.auth = { sessionID };
            //     socket.connect();
            // }
            // usePlayersStore.getState().setCurrentPlayer(user.id)
            if (!get().socket?.connected) get().connectSocket()
        }


    },

    connectSocket: () => {
        const sessionID = localStorage.getItem("sessionID");
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return
        console.log('auth store socket')

        const socket = io(API_URL, { autoConnect: false })

        socket.auth = { user: authUser }
        if (sessionID) {
            socket.auth = { ...socket.auth, sessionID };
        }
        socket.connect()
        // set({ socket: socket })
        socket.on('connect', () => set({ socket: socket }))
        socket.on('session', ({ sessionID, user }) => {
            console.log('session to localstorage', sessionID)
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            // socket.userID = user.id;
        })
        socket.on("connect_error", (err) => {
            if (err.message === "invalid user") {
                toast.error('Invalid user')
            } else {
                toast.error('connection error')
            }

        });



        socket.on('game:paused', handleGamePaused)
        socket.on('game:resumed', handleGameResumed)
        socket.on('game:restarted', handleGameRestarted)
        socket.on('game:ended', handleGameEnded)
        socket.on('disconnect', () => get().disconnectSocket())


    },
    disconnectSocket: () => {
        // if (get().socket?.connected) {

        get().socket?.off('connect_error')
        get().socket?.off('disconnect', () => set({ socket: null }))
        get().socket?.off('game:paused', handleGamePaused)
        get().socket?.off('game:resumed', handleGameResumed)
        get().socket?.off('game:restarted', handleGameRestarted)
        get().socket?.off('game:ended', handleGameEnded)
        get().socket?.disconnect()
        // }
    },
}))