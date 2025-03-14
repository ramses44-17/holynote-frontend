import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  ReactNode} from "react";
import { AuthContext } from "./auth-context";
import { Pen } from "lucide-react";







export  const AuthProvider = ({children}:{children:ReactNode}) => {

    const { data, isLoading, isError, error,refetch} = useQuery({
      queryKey:["me"],
      queryFn:async() => {
        const response = await axios.get("https://localhost:3000/api/users/me",{
          withCredentials:true
        })
        return response.data.user
      },
        refetchOnWindowFocus: false,
        retry:false
    })

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
        </div>
      )
    }
    if (isError) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          return (
            <div className="flex items-center justify-center min-h-screen flex-col bg-gray-100 dark:bg-gray-900 text-center p-6">
              {/* Logo */}
              <div className="flex items-center mb-6 text-gray-900 dark:text-white">
                <Pen className="-rotate-90 h-8 w-8 text-red-500" />
                <h1 className="text-2xl font-bold underline">
                  Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
                </h1>
              </div>
      
              {/* Message d'erreur */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Oups !</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Une erreur est survenue. Veuillez actualiser la page ou vérifier votre connexion.
                </p>
      
                {/* Bouton d'actualisation */}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
                >
                  Réessayer
                </button>
              </div>
            </div>
          );
        }
      }
    }
    
  return <AuthContext.Provider value={{user:data,isLoading,isError,error,refetch}}>
{children}
  </AuthContext.Provider>
}

