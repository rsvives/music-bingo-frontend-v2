// listeners


import { Router, redirect } from "@tanstack/react-router"
import toast from "react-hot-toast"
import { useGameStore } from "@/store/useGameStore"
import { useNumbersStore } from "@/store/useNumbersStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { Route } from "@/routes"
import { router } from "@/main"

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