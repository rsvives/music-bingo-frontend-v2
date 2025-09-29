import { twMerge } from "tailwind-merge"
import clsx from "clsx"
import superjson from 'superjson'

import { redirect } from '@tanstack/react-router'

import type { ClassValue } from "clsx"
import type { Player, PlayerId } from "@/types"
import { API_URL } from '@/lib/config'
import { useRoomStore } from "@/store/useRoomStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useNumbersStore } from "@/store/useNumbersStore"
import { useGameStore } from "@/store/useGameStore"

export function cn(...inputs: Array<ClassValue>) {
    return twMerge(
        clsx(inputs)
    )
}

export const isAdmin = () => {
    console.log('checking admin')
    if (useAuthStore.getState().authUser) {
        return (useAuthStore.getState().authUser?.id === useRoomStore.getState().admin?.id)
    } else {
        return false
    }
}




export const checkRoomCode = async ({ code, roomId }: { code: string | undefined, roomId: string }) => {

    const res = await fetch(`${API_URL}/api/room/code_check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId, code, userID: useAuthStore.getState().authUser?.id })
    })
    console.log(code, roomId, { userID: useAuthStore.getState().authUser?.id }, res)
    if (res.status == 404) throw redirect({ to: '/', search: { error: 'room not found' } })
    if (res.status == 401) throw redirect({ to: '/', search: { error: 'Unauthorized: wrong code' } })

    const { json, meta } = await res.json()
    const data: { admin: Player, players: Map<PlayerId, Player>, roomId: string, code: string } = superjson.deserialize({ json, meta })
    console.log('check', data)

    clearGameData()
    // TODO: check game status 
    if (data.roomId && data.code) {
        useGameStore.getState().setGameStatus('waiting')
        usePlayersStore.getState().setPlayers(data.players)
        useRoomStore.getState().setAdmin(data.admin)
        useRoomStore.getState().setRoomData({ roomId: data.roomId, code: data.code })
        // useNumbersStore.getState().setCalledNumbers()
        // useNumbersStore.getState().setMyBingoNumbers()
        return data
    }

}

export const checkRoomAdmin = async ({ code, roomId }: { code: string | undefined, roomId: string }) => {
    const res = await fetch(`${API_URL}/api/room/admin_check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId, code, userID: useAuthStore.getState().authUser?.id })
    })
    console.log(code, roomId, { userID: useAuthStore.getState().authUser?.id }, res)
    if (res.status == 404) throw redirect({ to: '/', search: { error: 'room not found' } })
    if (res.status == 401) throw redirect({ to: '/', search: { error: 'Unauthorized: wrong code' } })
    if (res.status == 403) throw redirect({ to: '/', search: { error: 'Forbidden: not a room admin' } })

    const { json, meta } = await res.json()
    const data: { admin: Player, players: Map<PlayerId, Player>, roomId: string, code: string } = superjson.deserialize({ json, meta })
    console.log('check', data)

    clearGameData()
    // TODO: check game status 
    if (data.roomId && data.code) {
        usePlayersStore.getState().setPlayers(data.players)
        useRoomStore.getState().setAdmin(data.admin)
        // useNumbersStore.getState().setMyBingoNumbers(data.players.get(useAuthStore.getState().authUser!.id)!.numbers)
        useRoomStore.getState().setRoomData({ roomId: data.roomId, code: data.code })
        // useNumbersStore.getState().setCalledNumbers()
        // useNumbersStore.getState().setMyBingoNumbers()
        return data
    }
}

export const clearGameData = () => {
    useNumbersStore.getState().resetNumbersStore()
    useRoomStore.getState().resetRoomStore()
    usePlayersStore.getState().resetScores()
    usePlayersStore.getState().resetPlayers()
}