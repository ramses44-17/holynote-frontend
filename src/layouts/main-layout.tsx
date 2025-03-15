import PublicHeader from "@/components/public-header"
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";
import { Outlet } from "react-router"
import Error from "@/components/error";




export default function MainLayout() {
 const {isError,error} = useAuth();

  if (isError) {
    if (!axios.isAxiosError(error)) {
      return <Error/>;
    }
  }
  return (
    <div>
      <PublicHeader/>
      <Outlet/>
    </div>
  )
}
