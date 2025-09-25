import { createFileRoute } from '@tanstack/react-router'
import { SignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useGameStore } from '@/store/useGameStore'
import { usePlayersStore } from '@/store/usePlayersStore'

export const Route = createFileRoute('/_auth/room')({
  component: Room,
  beforeLoad: () => console.log('loading room')

})


function Room() {
  const { isSignedIn, isLoaded, } = useUser()
  const { authUser } = useAuthStore()
  const { createRoom } = useGameStore()


  const handleCreateGame = () => {
    console.log('handle create game')
    if (authUser) {
      console.log(authUser)
      usePlayersStore.getState().setCurrentPlayer(authUser.id)
      console.log('starting')
      createRoom(authUser)
    }
  }

  console.log(useGameStore.getState())




  useEffect(handleCreateGame, [])

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
