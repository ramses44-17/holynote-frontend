import {Link} from "react-router"
import { Button } from "@/components/ui/button"
import { Pen, LogOut, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dispatch, SetStateAction } from "react"
import SearchBar from "./search-bar"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { apiBaseUrl } from "@/lib/utils"
import { useUserStore } from "@/stores/app-store"


export type MainMode = "view" | "search"

interface HeaderProps {
  mode:MainMode;
  setMode:Dispatch<SetStateAction<MainMode>>
  searchTerm:string
  setSearchTerm:Dispatch<SetStateAction<string>>
  // filterBy:string
  // setFilterBy:Dispatch<SetStateAction<string>>
}

const useLogout = (token:string | null) => {
  return useMutation({
    mutationFn:async () => {
      return axios.post(`${apiBaseUrl}/auth/logout`, {}, { withCredentials: true,headers: {
      Authorization: `Bearer ${token}`, // 👈 Ajout manuel ici
    }, });
    },
    onSuccess: () => { 
      window.location.reload()
    },
    onError: () => {
        toast({
          title: "Error",
          description: "Error while logout",
          variant: "error",
        });
    },
  })
};

export default function Header({mode,setMode,searchTerm,setSearchTerm}:HeaderProps) {
  const { user,accessToken } = useUserStore()
  const { mutate: logout,isPending} = useLogout(accessToken);

  
  
  return mode === "view" ? (
    <header className="p-4 flex justify-between items-center border-b bg-white text-black fixed w-full z-50">
      <Link to="/" className="flex items-center">
        <Pen className="-rotate-90" />
        <h1 className="text-xl font-semibold underline">
          Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
        </h1>
      </Link>
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
                {user && user.username[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-600 cursor-pointer"onClick={() => logout()} disabled={isPending}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isPending ? "Logging out..." : "Logout"}</span>
            </DropdownMenuItem>
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
              </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </header>
  ) : (
    <SearchBar  searchTerm={searchTerm} setMode={setMode} setSearchTerm={setSearchTerm} />
  )
}

