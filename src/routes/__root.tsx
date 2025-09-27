import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'react-hot-toast'
import Header from '../components/Header'




export const Route = createRootRoute({
  component: () => {

    return (<>

      <Header />
      <Outlet />
      <Toaster position='bottom-center' />
      {/* <TanStackRouterDevtools /> */}
    </>
    )
  },
  notFoundComponent: () => <div>404 not found😢</div>
})
