// listeners


import superjson from 'superjson'
import socket from './socket'
import type { SuperJSONResult, SuperJSONValue } from "node_modules/superjson/dist/types"
import type { Player, PlayersMap, User } from "@/types"
import { useGameStore } from "@/store/useGameStore"
import { useNumbersStore } from "@/store/useNumbersStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { router } from "@/main"
import { useAuthStore } from '@/store/useAuthStore'
import { useRoomStore } from '@/store/useRoomStore'

type SocketSessionData = {
    sessionID: string,
    user: User,
    bingoNumbers: [Array<number>, Array<number>, Array<number>] | null,
    markedNumbers: Set<number> | null,
    calledNumbers: Set<number> | null
}
export const handleSocketSession = ({ meta, json }: SuperJSONResult) => {
    const data: SocketSessionData = superjson.deserialize({ meta, json })
    const { sessionID, user, bingoNumbers, markedNumbers, calledNumbers } = data
    console.log('session to localstorage', sessionID, bingoNumbers)
    socket.auth = { sessionID };
    localStorage.setItem("sessionID", sessionID);

    socket.userID = user.id;

    if (bingoNumbers) {
        useNumbersStore.getState().setMyBingoNumbers(bingoNumbers)
    }
    if (markedNumbers) {
        useNumbersStore.getState().setMarkedNumbers(markedNumbers)
    }
    if (calledNumbers) {
        useNumbersStore.getState().setCalledNumbers(calledNumbers)
    }
}

export const handleGamePaused = () => {
    useGameStore.getState().setGameStatus('paused')
}
export const handleGameResumed = () => {
    useGameStore.getState().setGameStatus('started')
}

export const handleGameRestarted = () => {
    useGameStore.getState().reset()
    usePlayersStore.getState().resetScores()
    console.log('calledNumbers initial', useNumbersStore.getInitialState().calledNumbers)
    useNumbersStore.getState().resetNumbersStore()
    console.log('calledNumbers', useNumbersStore.getState().calledNumbers)

}

export const handleGameEnded = () => {
    console.log('redirecting game over')

    useGameStore.getState().setGameStatus('ended')
    router.navigate({ to: '/game_over' })
}

export const onRoomJoined = ({ json, meta }: SuperJSONValue) => {
    const data: { players: PlayersMap, lastJoinedPlayer: Player } = superjson.deserialize({ json, meta })
    console.log('joined', data)
    const { players: receivedPlayers } = data
    usePlayersStore.getState().setPlayers(receivedPlayers)
    useRoomStore.getState().setJoined(true)
    usePlayersStore.getState().setCurrentPlayer(useAuthStore.getState().authUser!.id)
}

export const onRoomLeaved = (playerId: string) => {
    console.log('leaved', playerId)
    usePlayersStore.getState().removePlayer(playerId)
    useRoomStore.getState().setJoined(false)
}

export const onRoomReady = ({ roomId, code, lastPlayerJoined: admin }: { roomId: string, code: string, lastPlayerJoined: Player }) => {
    console.log('room:ready')
    useRoomStore.getState().setAdmin(admin)
    usePlayersStore.getState().addPlayer(admin)
    useRoomStore.getState().setRoomData({ roomId: roomId, code })
    router.navigate({ to: '/room/$roomId', params: { roomId }, search: { code } })
}

export const onReconnect = ({ json, meta }: SuperJSONResult) => {
    const { roomId, code, admin, players }: { roomId: string, code: string, admin: Player, players: PlayersMap } = superjson.deserialize({ json, meta })
    console.log('room:reconnect', json)
    useRoomStore.getState().setRoomData({ roomId, code }) // TODO: Set players
    useRoomStore.getState().setAdmin(admin)
    usePlayersStore.getState().setPlayers(players)

    router.navigate({ to: '/room/$roomId', params: { roomId }, search: { code } })
}

export const onPlayerDisconnect = (player: Player) => {
    console.log('player disconnected', player)
    usePlayersStore.getState().setConnectionStatus(player.id, false)
    useRoomStore.getState().setJoined(false)
}

export const onPlayerRejoined = (player: Player) => {
    console.log('player rejoined 👍', player)
    usePlayersStore.getState().setConnectionStatus(player.id, true)
    useRoomStore.getState().setJoined(true)
}