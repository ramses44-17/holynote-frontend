import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  ReactNode} from "react";
import { AuthContext } from "./auth-context";
import Error from "@/components/error";
import Loader from "@/components/loader";







export  const AuthProvider = ({children}:{children:ReactNode}) => {
// const [user,setUser] = useState(null)
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
        <Loader/>
      )
    }
    if (isError) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          return (
            <Error/>
          );
        }
      }
    }
    
  return <AuthContext.Provider value={{user:data,isLoading,isError,error,refetch}}>
{children}
  </AuthContext.Provider>
}

