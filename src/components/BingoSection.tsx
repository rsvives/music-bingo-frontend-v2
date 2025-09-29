import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import socket from "@/socket/socket"

export const BingoSection = () => {
    const { authUser } = useAuthStore()
    const { admin } = useRoomStore()
    const { gameStatus, confetti, setConfetti, setGameStatus } = useGameStore()
    const { updateScore } = usePlayersStore()
    const {
        lastCalledNumber,
        setLastCalledNumber,
        myBingoNumbers, setMyBingoNumbers
    } = useNumbersStore()

    const SECONDS_TO_NEXT_NUMBER = 5

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
        socket.emit('number:next', ({ calledNumbers: [...useNumbersStore.getState().calledNumbers] }))
    }

    useEffect(() => {
        const handleNumberGenerated = (data: { randomNumber: number, calledNumbers: Array<number> }) => {
            console.log('number generated')
            console.log(data)
            const { randomNumber, calledNumbers } = data
            setLastCalledNumber(randomNumber)
            // addCalledNumber(randomNumber)
            useNumbersStore.getState().setCalledNumbers(new Set(calledNumbers))
        }
        const handlePlayerMarked = (playerID: string, score: number) => {

            console.log('marrrkkk', playerID, score)
            const playerMarked = usePlayersStore.getState().players.get(playerID)
            console.log('marked', playerMarked)
            if (playerMarked) {

                updateScore(playerMarked.id, score)

                if (playerID !== useAuthStore.getState().authUser?.id) {
                    toast.success(`${playerMarked.username} marked!`)
                }
            }
        }
        const handleLineWon = (playerID: string) => {
            const lineWinner = usePlayersStore.getState().players.get(playerID)
            console.log('handle line won', { lineWinner })
            if (lineWinner) {
                useGameStore.getState().setLineWinner(lineWinner)
                updateScore(lineWinner.id, lineWinner.score + 1)

                toast(`${lineWinner.username} won line`, { icon: '🎉' })

            }
        }
        const handleBingoWon = (playerID: string) => {
            console.log('bingo', playerID)
            const bingoWinner = usePlayersStore.getState().players.get(playerID)
            if (bingoWinner) {
                updateScore(bingoWinner.id, bingoWinner.score + 1)
                useGameStore.getState().setBingoWinner(bingoWinner)
                toast(`BINGO! ${bingoWinner.username} won! `, { icon: '🎉' })
                socket.emit('game:end')
            }
            // increaseMarked(playerID)

        }
        const handleGameStarted = ({ json, meta }) => {
            const { players: playersWithNumbers }: { players: Map<PlayerId, Player> } = superjson.deserialize({ json, meta })
            console.log('started', playersWithNumbers)
            setGameStatus('started')

            const myself = playersWithNumbers.get(authUser!.id)
            console.log('myself', myself, usePlayersStore.getState().currentPlayer)
            if (myself) {
                setMyBingoNumbers(myself.numbers)
            }
        }



        socket.on('game:number-generated', handleNumberGenerated)
        socket.on('player:line', handleLineWon)
        socket.on('player:bingo', handleBingoWon)
        socket.on('player:marked', handlePlayerMarked)
        socket.on('game:started', handleGameStarted)
        return () => {
            socket.off('game:number-generated', handleNumberGenerated)
            socket.off('player:line', handleLineWon)
            socket.off('player:bingo', handleBingoWon)
            socket.on('player:marked', handlePlayerMarked)
            socket.off('game:started', handleGameStarted)

        }
    }, [socket])


    return (
        <>
            <div>
                {confetti && <ConfettiExplosion particleCount={200} onComplete={() => setConfetti(false)} force={0.5} />}
            </div>
            {myBingoNumbers[0].length > 0 && < section id='bingo-numbers'>
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
                    <TimerProgressBar gameStatus={gameStatus} totalTime={SECONDS_TO_NEXT_NUMBER} />

                </div>
            </ section>}
        </>
    )
}

const TimerProgressBar = ({ gameStatus, totalTime = 10 }: { gameStatus: string, totalTime: number }) => {
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [isRunning, setIsRunning] = useState(false);
    // const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef(null);


    const progress = useMemo(() => {
        return (100 - (- (totalTime - timeLeft) / totalTime) * 100);
    }, [timeLeft, totalTime]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev + 0.1;
                if (newTime <= 0) {
                    setIsRunning(false);
                    return 0;
                }
                return newTime;
            });
        }, 100);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, timeLeft]);

    const startTimer = useCallback(() => {
        setIsRunning(true);
    }, []);
    const resetTimer = useCallback(() => {
        setTimeLeft(totalTime);
        setIsRunning(false);
        startTimer()
    }, []);

    const pauseTimer = useCallback(() => {
        setIsRunning(false);
    }, []);

    useEffect(() => {

        socket.on('game:number-generated', resetTimer)
        socket.on('game:started', resetTimer)
        socket.on('game:resumed', resetTimer)
        socket.on('game:paused', pauseTimer)
        socket.on('game:restarted', resetTimer)
        socket.on('game:ended', resetTimer)
        return () => {
            socket.off('game:number-generated', resetTimer)
            socket.off('game:started', resetTimer)
            socket.off('game:resumed', resetTimer)
            socket.off('game:paused', pauseTimer)
            socket.off('game:restarted', resetTimer)
            socket.off('game:ended', resetTimer)

        }
    }, [])

    if (gameStatus === 'waiting' || gameStatus === 'ended') {
        return <div className="h-2 mt-2"></div>
    }

    return (
        <div className="w-full relative z-0 bg-slate-300 h-2 mt-2 rounded-full">
            {/* {progress + ' ' + intervalRef.current} */}
            <div style={{ width: `${progress}%` }} className={cn(' relative z-0 bg-slate-800 h-2 rounded-full',
                'transition-all ease-in-out'
            )}></div>
        </div>
    )
}