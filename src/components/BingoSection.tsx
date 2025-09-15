import { useEffect } from "react"
import ConfettiExplosion from "react-confetti-explosion"
import toast from "react-hot-toast"
import superjson from 'superjson'
import { BingoCard } from "./BingoCard"
import type { Player, PlayerId } from "@/types"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { cn } from "@/lib/utils"
import { useNumbersStore } from "@/store/useNumbersStore"
import { usePlayersStore } from "@/store/usePlayersStore"
import { useRoomStore } from "@/store/useRoomStore"

export const BingoSection = () => {
    const { socket, authUser } = useAuthStore()
    const { admin } = useRoomStore()
    const { gameStatus, confetti, setLineWinner, setBingoWinner, setConfetti, setGameStatus } = useGameStore()
    const { updateScore } = usePlayersStore()
    const {
        lastCalledNumber,
        setLastCalledNumber,
        calledNumbers,
        addCalledNumber,
        myBingoNumbers, setMyBingoNumbers
    } = useNumbersStore()

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
        socket?.emit('game:next-number', ({ calledNumbers: [...useNumbersStore.getState().calledNumbers] }))
    }


    useEffect(() => {
        const handleNumberGenerated = (data: { randomNumber: number }) => {
            console.log('number generated')
            console.log(data)
            const { randomNumber } = data
            setLastCalledNumber(randomNumber)
            addCalledNumber(randomNumber)
        }
        const handleLineWon = (playerID: string) => {
            const lineWinner = usePlayersStore.getState().players.get(playerID)
            if (lineWinner) {
                setLineWinner(lineWinner)
                // increaseMarked(playerID)
                updateScore(lineWinner.id, lineWinner.score + 1)

                toast(`${lineWinner.username} won line`, { icon: '🎉' })

            }
        }
        const handlePlayerMarked = (playerID: string, score: number) => {

            console.log('marrrkkk', playerID, score)
            const playerMarked = usePlayersStore.getState().players.get(playerID)
            console.log('marked', playerMarked)
            // increaseMarked(playerID)
            if (playerMarked) {

                updateScore(playerMarked.id, score)

                if (playerID !== usePlayersStore.getState().currentPlayer!) {
                    toast.success(`${playerMarked.username} marked!`)
                }
            }
        }

        const handleBingoWon = (playerID: string) => {
            console.log('bingo', playerID)
            const bingoWinner = usePlayersStore.getState().players.get(playerID)
            if (bingoWinner) {
                updateScore(bingoWinner.id, bingoWinner.score + 1)
                setBingoWinner(bingoWinner)
                toast(`BINGO! ${bingoWinner.username} won! `, { icon: '🎉' })
                socket?.emit('game:end')
            }
            // increaseMarked(playerID)

        }
        const handleGameStarted = ({ json, meta }) => {
            const { players: playersWithNumbers }: { players: Map<PlayerId, Player> } = superjson.deserialize({ json, meta })
            console.log('started', playersWithNumbers)
            setGameStatus('started')

            const myself = playersWithNumbers.get(usePlayersStore.getState().currentPlayer!)
            console.log('myself', myself, usePlayersStore.getState().currentPlayer)
            if (myself) {
                setMyBingoNumbers(myself.numbers)
            }
        }



        socket?.on('game:number-generated', handleNumberGenerated)
        socket?.on('player:line', handleLineWon)
        socket?.on('player:bingo', handleBingoWon)
        socket?.on('player:marked', handlePlayerMarked)
        socket?.on('game:started', handleGameStarted)
        return () => {
            socket?.off('game:number-generated', handleNumberGenerated)
            socket?.off('player:line', handleLineWon)
            socket?.off('player:bingo', handleBingoWon)
            socket?.on('player:marked', handlePlayerMarked)
            socket?.off('game:started', handleGameStarted)

        }
    }, [socket])


    return (
        <>
            <div>
                {confetti && <ConfettiExplosion particleCount={200} onComplete={() => setConfetti(false)} force={0.5} />}
            </div>
            {
                <section id='bingo-numbers'>
                    {
                        gameStatus === 'started' &&
                        <h2 className='h-12 font-bold text-center text-4xl mb-2'>
                            {lastCalledNumber}
                        </h2>
                    }
                    {gameStatus === 'paused' &&
                        <h2 className='h-12 font-bold text-center text-xl mb-2 animate-pulse'>
                            game paused
                        </h2>
                    }
                    <div>
                        <BingoCard bingoNumbers={myBingoNumbers} className={gameStatus === 'paused' && 'bg-slate-300 text-slate-400 animate-pulse'} />
                        {gameStatus === 'started' ?
                            <div className="w-full relative z-0 bg-slate-300 h-2 mt-2 rounded-full">
                                <div className={cn(' relative z-0 bg-slate-800 h-2 rounded-full', 'animate-reduction')}></div>
                            </div>
                            :
                            <div className="h-2 mt-2"></div>
                        }

                    </div>
                </section>
            }
        </>
    )
}