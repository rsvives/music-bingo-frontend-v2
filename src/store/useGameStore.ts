import { create } from 'zustand'
import superjson from 'superjson'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './useAuthStore'
import type { PersistStorage } from 'zustand/middleware';
import type { Player, PlayerId, PlayersMap, User } from '@/types'



type State = {
    roomId: string,
    code: string,
    isJoined: boolean,
    calledNumbers: Set<number>,
    myMarkedNumbers: Set<number>,
    players: Map<PlayerId, Player>,
    lineWinner: Player | null,
    bingoWinner: Player | null,
    admin: User | null,
    gameStatus: 'waiting' | 'started' | 'ended'
    myNumbers: [Array<number>, Array<number>, Array<number>],
    lastNumber: number | null
    confetti: boolean
}
type Actions = {

    startGame: (admin: User) => void,
    setAdmin: (admin: Player) => void,
    createRoom: (user: User) => void,
    addPlayer: (newPlayer: Player) => void,
    removePlayer: (playerToRemove: PlayerId) => void,
    setLineWinner: (player: Player) => void,
    setBingoWinner: (player: Player) => void,
    setRoomData: ({ roomId, code }: { roomId: State["roomId"], code: State["code"] }) => void,
    setPlayers: (players: Map<PlayerId, Player>) => void
    increaseMarked: (playerId: PlayerId) => void,
    checkJoined: (player: Player) => void,
    setJoined: (joined: boolean) => void,
    setGameStatus: (status: State['gameStatus']) => void,
    setMyNumbers: (bingoNumbers: [Array<number>, Array<number>, Array<number>]) => void,
    setMarkedNumbers: (markedNumbers: Array<number>) => void,
    setLastNumber: (number: number) => void,
    addToMyMarkedNumbers: (number: number) => void,
    addToCalledNumbers: (number: number) => void,
    setConfetti: (bool: boolean) => void,
    reset: () => void
}

const storage: PersistStorage<State & Actions> = {
    getItem: (name) => {
        const str = localStorage.getItem(name)
        if (!str) return null
        return superjson.parse(str)
    },
    setItem: (name, value) => {
        localStorage.setItem(name, superjson.stringify(value))
    },
    removeItem: (name) => localStorage.removeItem(name),

}

export const useGameStore = create<State & Actions>()(
    persist(
        (set, get, store) => ({
            roomId: '',
            code: '',
            isJoined: false,
            admin: null,
            calledNumbers: new Set(),
            myMarkedNumbers: new Set(),
            myNumbers: [[], [], []],
            lineWinner: null,
            bingoWinner: null,
            players: new Map(),
            gameStatus: 'waiting',
            lastNumber: null,
            confetti: false,

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
                set({
                    players: get().players.set(newPlayer.id, newPlayer)
                }),
            setPlayers: (players) => set({ players: players }),

            removePlayer: (playerToRemove) => {
                const newPlayers = new Map(get().players)
                newPlayers.delete(playerToRemove)
                set({ players: newPlayers })
            },
            setLineWinner: (player) => set(() => ({ lineWinner: player })),
            setBingoWinner: (player) => set(() => ({ bingoWinner: player })),
            checkJoined: (player) => { console.log(player) },
            setJoined: (joined) => set({ isJoined: joined }),
            setGameStatus: (status) => set({ gameStatus: status }),
            setMyNumbers: (bingoNumbers) => {
                // const myNumbersSet = bingoNumbers.map(row => new Set(row))
                set({ myNumbers: bingoNumbers })
            },
            increaseMarked: (playerId) => {

                const player = get().players.get(playerId)
                if (player) {
                    player.marked += 1
                    const updatedPlayers = new Map(get().players)
                    updatedPlayers.set(player.id, player)
                    set({ players: updatedPlayers })
                }
            },

            setMarkedNumbers: (markedNumbers) => { set({ myMarkedNumbers: new Set(markedNumbers) }) },
            addToMyMarkedNumbers: (number) => { set({ myMarkedNumbers: get().myMarkedNumbers.add(number) }) },
            addToCalledNumbers: (number) => { set({ calledNumbers: get().calledNumbers.add(number) }) },
            setLastNumber: (number) => { set({ lastNumber: number }) },
            setConfetti: (bool) => { set({ confetti: bool }) },
            reset: () => {
                set(store.getInitialState())
            }

        }),
        {
            name: 'flabingo-game-storage', // name of the item in the storage (must be unique)
            storage,
        }
    )

)