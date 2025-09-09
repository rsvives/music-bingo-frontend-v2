import { create } from 'zustand'
import { useAuthStore } from './useAuthStore'
import type { Player, PlayerId, PlayersMap, User } from '@/types'



type State = {
    roomId: string,
    code: string,
    isJoined: boolean,
    markedNumbers: Set<number>,
    players: PlayersMap,
    lineWinner: Player | null,
    bingoWinner: Player | null,
    admin: User | null,
    gameStatus: 'waiting' | 'started' | 'ended'
    myNumbers: Array<Array<number>>,
    lastNumber: number | null
}
type Actions = {

    startGame: (admin: User) => void,
    createRoom: (user: User) => void,
    addPlayer: (newPlayer: Record<PlayerId, Player>) => void,
    removePlayer: (playerToRemove: PlayerId) => void,
    setLineWinner: (player: Player) => void,
    setBingoWinner: (player: Player) => void,
    setAdmin: (admin: Player) => void,
    setRoomData: ({ roomId, code }: { roomId: State["roomId"], code: State["code"] }) => void,
    setPlayers: (players: PlayersMap) => void
    checkJoined: (player: Player) => void,
    setJoined: (joined: boolean) => void,
    setGameStatus: (status: State['gameStatus']) => void
    setMyNumbers: (bingoNumbers: [Array<number>, Array<number>, Array<number>]) => void
    setMarkedNumbers: (markedNumbers: Array<number>) => void
    setLastNumber: (number: number) => void
    addToMarkedNumbers: (number: number) => void
}
export const useGameStore = create<State & Actions>((set, get) => ({
    roomId: '',
    code: '',
    isJoined: false,
    admin: null,
    markedNumbers: new Set(),
    myNumbers: [[]],
    lineWinner: null,
    bingoWinner: null,
    players: {},
    gameStatus: 'waiting',
    lastNumber: null,

    startGame: (admin) => {
        // get().setAdmin(admin)
        console.log('starting from store')
        // get().addPlayer(admin)
        useAuthStore.getState().socket?.emit('game:create', admin)
    },
    createRoom: (user) => {
        console.log('creating room')
        useAuthStore.getState().socket?.emit('room:create', user)
    },
    setRoomData: ({ roomId, code }) => {
        console.log(roomId, code)
        set({ roomId, code })
    },
    setAdmin: (admin) => {
        set({ admin: admin })
    },
    addPlayer: (newPlayer) =>
        set((state) => ({
            players: {
                ...state.players,
                ...newPlayer
            }
        })),
    setPlayers: (players) => set({ players }),
    removePlayer: (playerToRemove) =>
        set((state) => {
            const updatedPlayers = { ...state.players }
            delete updatedPlayers[playerToRemove]
            return { players: updatedPlayers }
        }),
    setLineWinner: (player) => set(() => ({ lineWinner: player })),
    setBingoWinner: (player) => set(() => ({ bingoWinner: player })),
    checkJoined: (player) => { console.log(player) },
    setJoined: (joined) => set({ isJoined: joined }),
    setGameStatus: (status) => set({ gameStatus: status }),
    setMyNumbers: (bingoNumbers) => {
        // const myNumbersSet = bingoNumbers.map(row => new Set(row))
        set({ myNumbers: bingoNumbers })
    },
    setMarkedNumbers: (markedNumbers) => { set({ markedNumbers: new Set(markedNumbers) }) },
    setLastNumber: (number) => { set({ lastNumber: number }) },
    addToMarkedNumbers: (number) => { set({ markedNumbers: get().markedNumbers.add(number) }) }
}))