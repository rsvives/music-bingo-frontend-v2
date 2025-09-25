import { RotateCcw } from "lucide-react"
import { GamePlayPauseButton } from "./GamePlayPauseButton"
import { Button } from "./ui/Button"
import socket from "@/socket/socket"
import { useGameStore } from "@/store/useGameStore"


export const GameControls = () => {

    const { gameStatus } = useGameStore()

    const handleRestart = () => {
        const confirmedRestart = confirm('Are you sure you want to restart the game?')
        if (confirmedRestart) {

            socket.emit('game:restart')
        }
    }

    return (
        <>
            {gameStatus !== 'waiting'
                &&
                <div className="flex justify-between items-center gap-4 w-full max-w-[320px]">
                    <Button fill="ghost" color="secondary" onClick={handleRestart} >
                        <RotateCcw strokeWidth={1} size={32} />
                    </Button >
                    <div className="flex gap-2">
                        <GamePlayPauseButton />
                    </div>

                </div>
            }
        </>
    )
}