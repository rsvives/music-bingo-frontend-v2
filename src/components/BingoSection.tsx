import { useEffect } from "react"
import { ArrowRightCircle } from "lucide-react"
import ConfettiExplosion from "react-confetti-explosion"
import { BingoCard } from "./BingoCard"
import { useAuthStore } from "@/store/useAuthStore"
import { useGameStore } from "@/store/useGameStore"
import { cn } from "@/lib/utils"

export const BingoSection = () => {
    const { socket, authUser } = useAuthStore()
    const { gameStatus, confetti, setConfetti, lastNumber, calledNumbers, roomId, admin, setLastNumber, addToCalledNumbers, myNumbers } = useGameStore()
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
    const handleNumberGenerated = () => {
        console.log('number generated')
        socket?.on('game:number-generated', (data) => {
            console.log(data)
            const { randomNumber } = data
            setLastNumber(randomNumber)
            addToCalledNumbers(randomNumber)

        })
    }
    useEffect(handleNumberGenerated, [socket])

    return (
        <div>
            <div>
                {confetti && <ConfettiExplosion particleCount={200} onComplete={() => setConfetti(false)} force={0.5} />}
            </div>
            {
                gameStatus === 'started' && <section id='bingo-numbers'>
                    <h2 className='h-12 font-bold text-center text-4xl mb-2'>{lastNumber}</h2>
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            {/* <h2 className='font-bold'>My bingo card:</h2> */}
                            {/* {authUser?.id === admin?.id &&
                                <button onClick={handleNextNumber} className='flex gap-2 items-center rounded-lg 0 border-black bg-flabingo-400 text-white text-xs font-bold uppercase px-3 py-2 hover:bg-flabingo-200 hover:cursor-pointer'>next number <ArrowRightCircle strokeWidth={1.5} /></button>} */}

                        </div>
                        <BingoCard bingoNumbers={myNumbers} />
                        <div className="w-full relative z-0 bg-slate-300 h-2 mt-2 rounded-full">
                            <div className={cn(' relative z-0 bg-slate-800 h-2 mt-2 rounded-full', 'animate-reduction')}>
                            </div>
                        </div>

                    </div>
                </section>
            }
        </div>
    )
}