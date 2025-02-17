import { Link } from 'react-router'
import { Button } from './ui/button'
import {Pen} from "lucide-react"
import { useAuth } from '@/contexts/authprovider'
import { Avatar, AvatarFallback } from './ui/avatar'

export default function Header() {

  const {user} = useAuth()
  return (
    <header className="p-4 flex justify-between items-center">
    <Link to="/" className='flex items-center'>
    <Pen className='-rotate-90 font-bold'/>
      <h1 className="text-xl font-semibold underline ">
        Holy<span className="bg-red-500 px-1 rounded-r-sm">Notes</span>
      </h1>
    </Link>
    {!user && <nav className="space-x-2">
      <Button variant="ghost" size="sm" asChild className='border border-blue-700 text-blue-700 font-extrabold hover:bg-none hover:text-blue-600'>
        <Link to="/login">Login</Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-700 border border-blue-950 hover:bg-blue-600 hover:text-white font-bold"
        asChild
      >
        <Link to="/register">Sign Up</Link>
      </Button>
    </nav>}
    {user &&<div class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white font-semibold text-lg uppercase">
  {user.username[0]}
</div>}
  </header>
  )
}
