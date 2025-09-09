// import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, parseSearchWith, stringifySearchWith } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
// import reportWebVitals from './reportWebVitals.ts'
import { ClerkWrapper, useClerkAuth } from './integrations/clerk/provider.tsx'
import { useAuthStore } from './store/useAuthStore.ts'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,

  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  parseSearch: parseSearchWith(JSON.parse),
  stringifySearch: stringifySearchWith(JSON.stringify),
  pathParamsAllowedCharacters: [
    ';',
    '$',
    '&',
    '@',
    '=',
    ',',
    '+',
    ':',
  ],

})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router,
  }
}

// Inner App
function InnerApp() {
  const auth = useClerkAuth()
  const { user } = useUser()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    if (user) checkAuth(user)

  }
    , [checkAuth, user])

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return <RouterProvider router={router} context={{ auth }} />
}


// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>
    <ClerkWrapper>
      <InnerApp />
    </ClerkWrapper>

    // </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
