import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router"




export default function AuthLayout() {

 const { isLoading,user } = useAuth();
 
    if(user && !isLoading){
      return <Navigate to="/notes" />
    }    

  return (
    <div>
      <Outlet/>
    </div>
  )
}