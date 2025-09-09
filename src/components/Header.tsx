import { useEffect } from 'react'
import ClerkHeader from '../integrations/clerk/header-user.tsx'
import { useAuthStore } from '@/store/useAuthStore.ts'
import { useGameStore } from '@/store/useGameStore.ts'

export default function Header() {

  const { socket } = useAuthStore()
  const { roomId } = useGameStore()
  const handleClick = () => {
    socket?.emit('click', { roomId })
  }

  useEffect(() => {
    socket?.on('clicked', (data) => {
      console.log('somebody clicked', data)
    })
  }, [socket])

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <span>{socket?.id}</span>
      <button onClick={handleClick}> click</button>
      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
