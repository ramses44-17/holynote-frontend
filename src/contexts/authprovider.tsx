import axios from "axios";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";


interface User {
  id:string;
  username:string;
}


interface AuthContextType {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  isLoading:boolean
}
const AuthContext = createContext<AuthContextType | null>(null)




export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({children}:{children:ReactNode}) => {
  const [user,setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true, // Inclut les cookies pour vérifier la session
        })
        setUser(response.data.user) // Si l'utilisateur est connecté, on le met à jour dans le contexte
      } catch (error) {
        console.log("Erreur de récupération de l'utilisateur :", error)
        setUser(null) // Si aucune session active, aucun utilisateur
      }finally{
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])
  
  return <AuthContext.Provider value={{user,setUser,isLoading}}>
{children}
  </AuthContext.Provider>
}
