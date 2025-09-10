import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
// import { socket } from '../../socket'

// import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useGameStore } from '@/store/useGameStore'

export const Route = createFileRoute('/_auth/room')({
  component: Room,
  beforeLoad: () => console.log('loading room')

})


function Room() {
  const { isSignedIn, isLoaded, } = useUser()
  const { socket, authUser } = useAuthStore()
  const { createRoom, setAdmin, setRoomData, addPlayer } = useGameStore()
  const navigate = useNavigate()


  const handleCreateGame = () => {
    console.log('handle create game')
    if (authUser) {
      console.log(authUser)
      console.log('starting')
      createRoom(authUser)
    }
  }

  const onRoomReady = () => {
    if (socket) {
      console.log('room:ready')
      // console.log('on game created', socket)
      socket.on('room:ready', (data) => {
        console.log(data)
        if (data) {
          const { room, code, lastPlayerJoined: admin } = data
          setAdmin(admin)
          addPlayer(admin)
          console.log(useGameStore.getState().players)
          setRoomData({ roomId: room, code })
          navigate({ to: '/room/$roomId', params: { roomId: room }, search: { code } })
        }
      })
    }
  }

  useEffect(handleCreateGame, [socket])

  useEffect(onRoomReady, [socket])

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>
  }

  if (!isSignedIn) {
    return <div className="p-4"><SignIn /></div>
  }

  return (
    <div className="text-center">

    </div>
  )
}
