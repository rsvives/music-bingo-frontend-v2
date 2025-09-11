import { useEffect } from "react"
import ConfettiExplosion from "react-confetti-explosion"
import toast from "react-hot-toast"
import { BingoCard } from "./BingoCard"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { cn } from "@/lib/utils"

export const BingoSection = () => {
    const { socket, authUser } = useAuthStore()
    const { gameStatus, increaseMarked, confetti, players, setLineWinner, setBingoWinner, setConfetti, lastNumber, calledNumbers, roomId, admin, setLastNumber, addToCalledNumbers, myNumbers } = useGameStore()
    const SECONDS_TO_NEXT_NUMBER = 7.5

    useEffect(() => {
        if (authUser?.id === admin?.id && gameStatus === 'started') {

            const interval = setInterval(handleNextNumber, SECONDS_TO_NEXT_NUMBER * 1000)
            return () => {
                clearInterval(interval)
            }
        }
    }, [gameStatus])

    const handleNextNumber = () => {
        console.log('next number')
        socket?.emit('game:next-number', ({ calledNumbers: [...calledNumbers], roomId }))
    }


    useEffect(() => {
        const handleNumberGenerated = (data: { randomNumber: number }) => {
            console.log('number generated')
            console.log(data)
            const { randomNumber } = data
            setLastNumber(randomNumber)
            addToCalledNumbers(randomNumber)
        }
        const handleLineWon = (playerID: string) => {
            const lineWinner = players.get(playerID)
            setLineWinner(lineWinner!)
            increaseMarked(playerID)
            toast(`${lineWinner?.username} won line`, { icon: '🎉' })
        }
        const handlePlayerMarked = (playerID: string) => {
            const playerMarked = players.get(playerID)
            increaseMarked(playerID)
            toast.success(`${playerMarked?.username} marked!`)
        }

        const handleBingoWon = (playerID: string) => {
            console.log('bingo', playerID)
            const bingoWinner = players.get(playerID)
            increaseMarked(playerID)
            setBingoWinner(bingoWinner!)
            toast(`BINGO! ${bingoWinner?.username} won! `, { icon: '🎉' })

        }

        socket?.on('game:number-generated', handleNumberGenerated)
        socket?.on('player:line', handleLineWon)
        socket?.on('player:bingo', handleBingoWon)
        socket?.on('player:marked', handlePlayerMarked)
        return () => {
            socket?.off('game:number-generated', handleNumberGenerated)
            socket?.off('player:line', handleLineWon)
            socket?.off('player:bingo', handleBingoWon)
            socket?.on('player:marked', handlePlayerMarked)

        }
    }, [socket])

    return (
        <div>
            <div>
                {confetti && <ConfettiExplosion particleCount={200} onComplete={() => setConfetti(false)} force={0.5} />}
            </div>
            {
                gameStatus === 'started' && <section id='bingo-numbers'>
                    <h2 className='h-12 font-bold text-center text-4xl mb-2'>{lastNumber}</h2>
                    <div>
                        <BingoCard bingoNumbers={myNumbers} />
                        <div className="w-full relative z-0 bg-slate-300 h-2 mt-2 rounded-full">
                            <div className={cn(' relative z-0 bg-slate-800 h-2 mt-2 rounded-full', 'animate-reduction')}></div>
                        </div>

                    </div>
                </section>
            }
        </div>
    )
}