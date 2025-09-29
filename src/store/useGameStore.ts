import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Player, User } from '@/types'
import { createSuperjsonStorage } from '@/lib/config'
import socket from '@/socket/socket'

type State = {

    lineWinner: Player | null,
    bingoWinner: Player | null,
    gameStatus: 'waiting' | 'started' | 'ended' | 'paused'
    confetti: boolean
}
type Actions = {

    startGame: (admin: User) => void,
    createRoom: (user: User) => void,
    setLineWinner: (player: Player) => void,
    setBingoWinner: (player: Player) => void,
    setGameStatus: (status: State['gameStatus']) => void,
    setConfetti: (bool: boolean) => void,
    reset: () => void
}


const storage = createSuperjsonStorage<State & Actions>()

export const useGameStore = create<State & Actions>()(
    persist(
        (set, _, store) => ({

            lineWinner: null,
            bingoWinner: null,
            players: new Map(),
            gameStatus: 'waiting',
            confetti: false,

            startGame: (admin) => {
                // get().setAdmin(admin)
                // console.log('starting from store')
                // get().addPlayer(admin)
                socket.emit('game:create', admin)
            },
            createRoom: (user) => {
                // console.log('creating room')
                socket.emit('room:create', user)
            },
            setLineWinner: (player) => set(() => ({ lineWinner: player })),
            setBingoWinner: (player) => set(() => ({ bingoWinner: player })),
            setGameStatus: (status) => set({ gameStatus: status }),
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