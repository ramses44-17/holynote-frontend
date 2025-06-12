import { useUserStore } from "@/stores/user-store";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthUser } from "@/hooks/use-auth";
import Loader from "@/components/loader";

const Protected = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const { isLoading, isFetching } = useAuthUser();

  // Tant que la requête /auth/me est en cours, on attend (ex: cookies présents mais store vide)
  if (isLoading || isFetching) {
    return <Loader/>; // ou un spinner stylé
  }

  

  // Si aucun utilisateur → redirection
  if (!user) return <Navigate to="/auth" />;

  // Utilisateur bien authentifié
  return <>{children}</>;
};

export default Protected;
