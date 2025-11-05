import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Header from '../components/Header'
import { DebugFooter } from '@/components/DebugFooter'
import { useGameStore } from '@/store/useGameStore'




export const Route = createRootRoute({
  component: () => {
    const { gameStatus } = useGameStore()
    useEffect(() => {
      console.log('gamestatus', gameStatus)
    }, [gameStatus])

    return (
      <>

        <Header />
        <Outlet />
        <Toaster position='bottom-center' />
        {/* <TanStackRouterDevtools /> */}
        {/* <DebugFooter /> */}
      </>
    )
  },
  notFoundComponent: () => <div>404 not found😢</div>
})
