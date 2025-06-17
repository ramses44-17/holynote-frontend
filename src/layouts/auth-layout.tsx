import { useUserStore } from "@/stores/user-store";
import { Navigate, Outlet } from "react-router";
import { useAuthUser } from "@/hooks/use-auth"; // ton hook custom
import Loader from "@/components/loader";
import axios from "axios";
import Error from "@/components/error";


export default function AuthLayout() {
  const { user } = useUserStore();
  const { isFetching, isLoading,isError,error } = useAuthUser();

  // Tant qu'on vérifie le statut avec /auth/me (ex: cookie présent mais store vide)
  if (isFetching || isLoading) {
    return <Loader/>; // tu peux mettre un vrai skeleton ici
  }

  if (isError) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return <Outlet />;
        }
      }
    }

    
  // Si l'utilisateur est connecté, on redirige
  if (user) {
    return <Navigate to="/notes" />;
  }
  
return <Error/>
}
