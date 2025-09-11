import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import superjson from 'superjson'
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
  const { createRoom, setAdmin, setRoomData, addPlayer, setPlayers } = useGameStore()
  const navigate = useNavigate()


  const handleCreateGame = () => {
    console.log('handle create game')
    if (authUser) {
      console.log(authUser)
      console.log('starting')
      createRoom(authUser)
    }
  }

  console.log(useGameStore.getState())


  useEffect(() => {
    console.log('handle events')

    function onRoomReady(data) {
      console.log('room:ready')
      console.log(data)
      if (data) {
        const { roomId, code, lastPlayerJoined: admin } = data
        setAdmin(admin)
        addPlayer(admin)
        console.log(useGameStore.getState().players)
        setRoomData({ roomId: roomId, code })
        navigate({ to: '/room/$roomId', params: { roomId }, search: { code } })
      }
    }

    function onReconnect({ json, meta }) {
      const { roomId, code, admin, players } = superjson.deserialize({ json, meta })
      console.log('room:reconnect', players)
      setRoomData({ roomId, code }) // TODO: Set players
      setAdmin(admin)
      setPlayers(players)

      navigate({ to: '/room/$roomId', params: { roomId }, search: { code } })
    }
    if (socket) {

      socket.on('room:ready', onRoomReady)
      socket.on('room:reconnect', onReconnect)
    }



    return () => {
      socket?.off('room:ready', onRoomReady)
      socket?.off('room:reconnect', onReconnect)
    }
  }, [socket])

  useEffect(handleCreateGame, [socket])

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
