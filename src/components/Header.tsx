import { useNavigate } from '@tanstack/react-router'
import ClerkHeader from '../integrations/clerk/header-user.tsx'
import socket from '@/socket/socket.ts'
import { isAdmin } from '@/lib/utils.ts'
import { useGameStore } from '@/store/useGameStore.ts'


export default function Header() {

  const navigate = useNavigate()

  const handleGoHome = () => {
    const baseText = 'Are you sure you want to leave?'
    const confirmText = isAdmin() ?
      `${baseText} This action will delete the room and its players` : baseText

    // TODO: refactor this shit
    if (useGameStore.getState().gameStatus !== 'waiting' || useGameStore.getState().gameStatus !== 'ended') {
      const confirmed = confirm(confirmText)
      if (isAdmin()) socket.emit('game:paused')
      if (confirmed) {
        if (isAdmin()) {
          socket.emit('game:end')
        } else {
          socket.emit('room:leave')
        }
        navigate({ to: '/', reloadDocument: true, replace: true })
      } else {
        if (isAdmin()) socket.emit('game:resumed')
      }

    } else {
      navigate({ to: '/', reloadDocument: true, replace: true })
    }
  }
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between items-center">
      <button onClick={handleGoHome}>
        <img src='/logo.svg' className='h-[48px]'></img>
      </button>
      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
