import { Link } from 'react-router'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="border-b border-gray-700 p-4 flex justify-between items-center">
    <Link to="/">
      <h1 className="text-xl font-semibold underline decoration-amber-700">
        Holy<span className="bg-red-500 px-1 rounded-r-sm">Notes</span>
      </h1>
    </Link>
    <nav className="space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/login">Login</Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-amber-700 hover:text-amber-500"
        asChild
      >
        <Link to="/register">Register</Link>
      </Button>
    </nav>
  </header>
  )
}
