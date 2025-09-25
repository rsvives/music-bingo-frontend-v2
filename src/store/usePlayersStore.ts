import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, PlayerId, PlayersMap } from '@/types';
import { createSuperjsonStorage } from '@/lib/utils';



interface PlayersState {
    players: Map<PlayerId, Player>
    currentPlayer: string | null
    isAdmin: boolean | null
    addPlayer: (player: Player) => void
    setPlayers: (players: PlayersMap) => void
    removePlayer: (playerId: PlayerId) => void
    updatePlayer: (playerId: PlayerId, updates: Partial<Player>) => void
    updateScore: (playerId: PlayerId, score: number) => void
    setCurrentPlayer: (playerId: string) => void
    setAdmin: (bool: boolean) => void
    setConnectionStatus: (playerId: PlayerId, bool: boolean) => void
    resetScores: () => void
    resetPlayers: () => void
}
const storage = createSuperjsonStorage<PlayersState>()

export const usePlayersStore = create<PlayersState>()(
    persist(
        (set, get, store) => ({
            players: new Map(),
            currentPlayer: null,
            isAdmin: null,

            addPlayer: (playerData) => set((state) => {
                const updatedPlayers = state.players
                updatedPlayers.set(playerData.id, playerData)

                if (playerData.isAdmin) get().setAdmin(true)

                return { players: updatedPlayers }
            }),
            setPlayers: (players) => { set({ players: players }) },

            removePlayer: (playerId) => set((state) => {
                const updatedPlayers = state.players
                updatedPlayers.delete(playerId)
                return {
                    players: updatedPlayers
                }
            }),

            updatePlayer: (playerId, updates) => set((state) => {
                const updatedPlayers = state.players

                const playerToUpdate = updatedPlayers.get(playerId)
                if (!playerToUpdate) return { players: updatedPlayers }

                const newData = {
                    ...playerToUpdate,
                    ...updates
                } as Player
                updatedPlayers.set(playerId, newData)
                return { players: updatedPlayers }
            }),
            updateScore: (playerId, score) => set((state) => {
                const updatedPlayers = state.players
                const playerToUpdate = updatedPlayers.get(playerId)

                if (!playerToUpdate) return { players: updatedPlayers }

                updatedPlayers.set(playerId, { ...playerToUpdate, score })
                return { players: updatedPlayers }
            }),

            setCurrentPlayer: (player) => set({ currentPlayer: player }),
            setAdmin: (boolean) => { set({ isAdmin: boolean }) },
            setConnectionStatus: (playerId, connectionStatus) => {
                const updatedPlayers = get().players
                const player = updatedPlayers.get(playerId)
                if (player) {
                    updatedPlayers.set(playerId, { ...player, connected: connectionStatus })
                    set({ players: updatedPlayers })
                }
            },
            resetScores: () => {
                const previousPlayers = get().players
                const updatedPlayers = new Map()
                previousPlayers.forEach((p: Player) => {
                    updatedPlayers.set(p.id, {
                        ...p,
                        numbers: [[], [], []],
                        marked: new Set(),
                        score: 0,
                    })
                })
                set({ players: updatedPlayers })
            },
            resetPlayers: () => set(store.getInitialState()),
        }),
        {
            name: 'flabingo-players-storage', // name of the item in the storage (must be unique)
            storage,
        }
    )
)