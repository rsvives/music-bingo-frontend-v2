import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import ClerkHeader from '../integrations/clerk/header-user.tsx'
import { useAuthStore } from '@/store/useAuthStore.ts'


export default function Header() {

  const { socket } = useAuthStore()



  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between items-center">
      <Link to='/'>
        <img src='/logo.svg' className='h-[48px]'></img>
      </Link>
      {/* {process.env.NODE_ENV !== 'production' && <span>{socket?.id}</span>} */}
      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
