import {Link} from "react-router"
import { Button } from "@/components/ui/button"
import { Pen, LogOut, Search, Settings, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dispatch, SetStateAction } from "react"
import SearchBar from "./search-bar"


export type Mode = "view" | "search"

interface HeaderProps {
  mode:Mode;
  setMode:Dispatch<SetStateAction<Mode>>
}
export default function Header({mode,setMode}:HeaderProps) {
  // const { user } = useAuth()
  
  const user  = {
    username:"amos"
  }

  return mode === "view" ? (
    <header className="p-4 flex justify-between items-center border-b bg-white text-black">
      <Link to="/" className="flex items-center">
        <Pen className="-rotate-90" />
        <h1 className="text-xl font-semibold underline">
          Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
        </h1>
      </Link>
      {!user && (
        <nav className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="border border-blue-700 text-blue-700 bg-none font-bold hover:bg-none"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="default" size="sm" className="bg-blue-700 hover:bg-blue-600 text-white font-bold" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
        </nav>
      )}
      {user && (
        <div className="flex items-center gap-2">
          <Button variant="outline"
          className="shadow-none border-none cursor-pointer"
          size="icon"
          onClick={() => setMode("search")}
          >
          <Search className="h-6 w-6"/>
          </Button>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg uppercase">
                {user.username[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => {}}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )}
    </header>
  ) : (
    <SearchBar setMode={setMode}/>
  )
  
}

