import PublicHeader from "@/components/public-header"
import { Outlet } from "react-router"




export default function MainLayout() {
  return (
    <div>
      <PublicHeader/>
      <Outlet/>
    </div>
  )
}
