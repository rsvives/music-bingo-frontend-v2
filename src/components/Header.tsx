import { Link } from '@tanstack/react-router'
import ClerkHeader from '../integrations/clerk/header-user.tsx'


export default function Header() {

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
