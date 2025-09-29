import { createFileRoute } from '@tanstack/react-router'
import { CheckLine, ListOrdered, Trophy } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { PlayerCard } from '@/components/PlayerCard'
import { useNumbersStore } from '@/store/useNumbersStore'

export const Route = createFileRoute('/_auth/game_over')({
    component: RouteComponent,
})

function RouteComponent() {
    const { lineWinner, bingoWinner } = useGameStore()
    const { calledNumbers } = useNumbersStore()

    if (!lineWinner || !bingoWinner) {

        return (
            <main className='min-h-[80vh] flex flex-1 items-center justify-center'>
                <div>Loading data...</div>
            </main>
        )
    }
    return (

        <main className='flex flex-1 gap-4 flex-col items-center justify-center'>

            <h1 className='text-4xl font-medium mt-4 sm:mt-0'>Game Over</h1>
            <section className='flex flex-col-reverse gap-4 flex-1 sm:flex-0 items-center justify-center p-4 w-full max-w-[360px]'>
                <div className='flex gap-2 text-lg items-center font-medium text-slate-700 w-full border-1 rounded-md p-4 border-slate-200'>
                    <h2 className='flex gap-2 items-center' > <ListOrdered size={16} /> Called Numbers:</h2>
                    <p >{calledNumbers.size}</p>
                </div>
                <div className='flex flex-col gap-2 w-full border-1 rounded-md p-4 border-slate-200'>
                    <h2 className='flex gap-2 text-lg items-center font-medium text-slate-700' > <CheckLine size={16} /> Line winner:</h2>
                    <PlayerCard showIsAdmin={false} showProgress={false} player={lineWinner} />
                </div>
                <div className='flex flex-col gap-2 w-full border-1 rounded-md shadow-md  border-slate-500 p-4'>
                    <h2 className='flex gap-2 text-xl items-center font-semibold text-slate-700' > <Trophy size={20} strokeWidth={1.8} /> Bingo winner:</h2>
                    <PlayerCard showIsAdmin={false} showProgress={false} player={bingoWinner} showConnected={false} />
                </div>
            </section>
        </main>
    )

}
