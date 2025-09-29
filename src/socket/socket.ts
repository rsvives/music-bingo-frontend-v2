import { io } from 'socket.io-client'
import { API_URL } from '@/lib/config';

const socket = io(API_URL, { autoConnect: true })

socket.onAny((event, ...args) => {
    console.log(event, args);
});

// Custom Property userID on socket
declare module 'socket.io-client' {
    interface Socket {
        userID?: string;
    }
}

export default socket;