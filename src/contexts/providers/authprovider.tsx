import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  ReactNode} from "react";
import { AuthContext } from "./auth-context";







export  const AuthProvider = ({children}:{children:ReactNode}) => {

    const { data, isLoading, isError, error,refetch} = useQuery({
      queryKey:["me"],
      queryFn:async() => {
        const response = await axios.get("http://localhost:3000/api/users/me",{
          withCredentials:true
        })
        return response.data.user
      },
      retry:false,
        refetchOnWindowFocus: false
    })

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
        </div>
      )
    }
  return <AuthContext.Provider value={{user:data,isLoading,isError,error,refetch}}>
{children}
  </AuthContext.Provider>
}

//j'ai ajouté un refetch