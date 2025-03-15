import { Pen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function PublicHeader() {
  return (
    <header className="p-4 flex justify-between items-center border-b bg-white text-black">
      <Link to="/" className="flex items-center">
        <Pen className="-rotate-90" />
        <h1 className="text-xl font-semibold underline">
          Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
        </h1>
      </Link>
        <nav className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="border border-blue-700 text-blue-700 bg-none font-bold hover:bg-none"
          >
            <Link to="/auth">Login</Link>
          </Button>
          <Button variant="default" size="sm" className="bg-blue-700 hover:bg-blue-600 text-white font-bold" asChild>
            <Link to="/auth/register">Sign Up</Link>
          </Button>
        </nav>
    </header>
  )
}
