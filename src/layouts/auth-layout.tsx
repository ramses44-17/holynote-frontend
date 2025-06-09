import { useUserStore } from "@/stores/app-store";
import { Navigate, Outlet } from "react-router"




export default function AuthLayout() {

 const { user} = useUserStore();
 
    if(user){
      return <Navigate to="/notes" />
    }    

  return (
    <div>
      <Outlet/>
    </div>
  )
}