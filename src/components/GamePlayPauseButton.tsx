import { PauseCircleIcon, PlayCircleIcon, } from "lucide-react"
import { Button } from "./ui/Button"
import { useGameStore } from "@/store/useGameStore"
import socket from "@/socket/socket"

export const GamePlayPauseButton = () => {
    const { gameStatus, setGameStatus } = useGameStore()

    const handleGameStatus = () => {

        if (gameStatus === 'started') {
            socket.emit('game:pause')
            setGameStatus('paused')
            return
        }
        if (gameStatus === 'paused') {
            socket.emit('game:resume')
            setGameStatus('started')
            return
        }

    }

    const dimensions = {
        size: 32,
        strokeWidth: 1
    }

    if (gameStatus === 'paused') {
        return (
            <Button fill="ghost" color="secondary" onClick={handleGameStatus}>
                <PlayCircleIcon {...dimensions} />
            </Button>
        )
    }
    if (gameStatus === 'started') {
        return (
            <Button fill="ghost" color="secondary" onClick={handleGameStatus} >
                <PauseCircleIcon {...dimensions} />
            </Button>
        )
    }
}