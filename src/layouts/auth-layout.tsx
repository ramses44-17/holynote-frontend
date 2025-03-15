import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router"
import Error from "@/components/error";
import axios from "axios";




export default function AuthLayout() {

 const { isLoading,user ,isError,error} = useAuth();
 
    if(user && !isLoading){
      return <Navigate to="/notes" />
    }    

  if (isError) {
    if (!axios.isAxiosError(error)) {
      return <Error/>;
    }
  }

  return (
    <div>
      <Outlet/>
    </div>
  )
}