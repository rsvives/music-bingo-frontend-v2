import { CircleX, RotateCcw } from "lucide-react"
import { GamePlayPauseButton } from "./GamePlayPauseButton"
import { Button } from "./ui/Button"
import { useGameStore } from "@/store/useGameStore"
import { useAuthStore } from "@/store/useAuthStore"


export const GameControls = () => {

    const { socket } = useAuthStore()

    const handleRestart = () => {
        const confirmedRestart = confirm('Are you sure you want to restart the game?')
        if (confirmedRestart) {

            socket?.emit('game:restart')
        }
    }

    return (
        <div className="flex justify-between items-center gap-4 w-full max-w-[320px]">
            <Button fill="ghost" color="secondary" onClick={handleRestart}>
                <RotateCcw strokeWidth={1} size={32} />
            </Button>
            <div className="flex gap-2">
                <GamePlayPauseButton />
            </div>
            {/* <Button fill="ghost" color="secondary">
                <CircleX strokeWidth={1} size={32} />
            </Button> */}
        </div>
    )
}