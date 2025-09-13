import { create } from 'zustand';
import type { Player, PlayerId, PlayersMap } from '@/types';



interface PlayersState {
    players: Map<PlayerId, Player>
    currentPlayer: Player | null
    addPlayer: (player: Player) => void
    setPlayers: (players: PlayersMap) => void
    removePlayer: (playerId: PlayerId) => void
    updatePlayer: (playerId: PlayerId, updates: Partial<Player>) => void
    updateScore: (playerId: PlayerId, score: number) => void
    setCurrentPlayer: (player: Player) => void
    resetPlayers: () => void
}

export const usePlayersStore = create<PlayersState>((set, get, store) => ({
    players: new Map(),
    currentPlayer: null,

    addPlayer: (playerData) => set((state) => {
        const updatedPlayers = state.players
        updatedPlayers.set(playerData.id, playerData)

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

    resetPlayers: () => set(store.getInitialState()),
}));