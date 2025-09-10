import { Link, createFileRoute } from '@tanstack/react-router'
import ConfettiExplosion from 'react-confetti-explosion'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/useGameStore'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    useEffect(() => { setConfetti(true) }, [])
    const { confetti, setConfetti } = useGameStore()
    return (<>
        <main className='flex flex-1 min-h-[85vh] flex-col gap-4 items-center justify-center pb-8'>
            <div>
                {confetti && <ConfettiExplosion particleCount={200} onComplete={() => setConfetti(false)} force={0.5} />}
            </div>
            <div className='flex flex-col gap-2 items-center justify-center'>
                {/* <span className='text-4xl'>🦩</span> */}
                <h2 className='text-2xl font-medium'>🦩 Welcome to flabingo!</h2>
            </div>
            <h1 className='text-4xl font-bold max-w-[500px] text-center'>The Bingo Playing Platform for Friends and Fun 🎉</h1>
            <p>Choose between:</p>
            <div className='flex gap-4 mt-6 flex-row-reverse'>
                <Link to='/room' >
                    <Button fill='solid' color='primary'>Regular Bingo ✨</Button>
                </Link>

                <Button fill='outline' color='secondary' onClick={() => toast('Work In Progress: Will be available soon', { icon: '⏳' })}>Music Bingo 🎵</Button>


            </div>
        </main>
    </>
    )

}
