import { create } from 'zustand'
// import { io } from 'socket.io-client'
import toast from 'react-hot-toast';
// import type { Socket } from 'socket.io-client';
import type { User } from '@/types'
import type { UserResource } from '@clerk/types'
import { API_URL } from '@/lib/config';
import { handleGameEnded, handleGamePaused, handleGameRestarted, handleGameResumed, handleSocketSession, onPlayerDisconnect, onReconnect, onRoomJoined, onRoomLeaved, onRoomReady } from '@/socket/listeners';
import socket from '@/socket/socket';
// import { socket } from '@/socket'



type State = {
    authUser: User | null
    // socket: Socket | null
}
type Actions = {
    checkAuth: (user: UserResource) => void
    checkSession: () => void
    connectSocket: () => void,
    disconnectSocket: () => void,
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
            if (!socket.connected) get().connectSocket()
        }


    },

    checkSession: () => {

    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || socket.connected) return
        console.log('auth store socket')

        const sessionID = localStorage.getItem("sessionID");
        socket.auth = { user: useAuthStore.getState().authUser }
        if (sessionID) {
            socket.auth = { ...socket.auth, sessionID };
            socket.connect()
        } else {
            socket.auth = { user: authUser }
            socket.connect()
        }

        // set({ socket: socket })
        // socket.on('connect', () => set({ socket: socket }))

        socket.on("connect_error", (err) => {
            if (err.message === "invalid user") {
                toast.error('Invalid user')
            } else {
                toast.error('connection error')
            }

        });



        socket.on('session', handleSocketSession)
        socket.on('game:paused', handleGamePaused)
        socket.on('game:resumed', handleGameResumed)
        socket.on('game:restarted', handleGameRestarted)
        socket.on('game:ended', handleGameEnded)
        socket.on('room:ready', onRoomReady)
        socket.on('room:reconnect', onReconnect)
        socket.on('room:joined', onRoomJoined)
        socket.on('room:leaved', onRoomLeaved)
        socket.on('player:disconnected', onPlayerDisconnect)

        socket.on('disconnect', () => {
            console.log('disconnect')
            get().disconnectSocket()
        })


    },
    disconnectSocket: () => {
        // if (get().socket?.connected) {

        socket.off('connect_error')
        socket.off('disconnect', () => socket.disconnect())
        socket.off('game:paused', handleGamePaused)
        socket.off('game:resumed', handleGameResumed)
        socket.off('game:restarted', handleGameRestarted)
        socket.off('game:ended', handleGameEnded)
        socket.off('room:joined', onRoomJoined)
        socket.off('room:leaved', onRoomLeaved)
        socket.off('room:ready', onRoomReady)
        socket.off('room:reconnect', onReconnect)
        socket.on('player:disconnected', onPlayerDisconnect)
        socket.disconnect()
        // }
    },
}))