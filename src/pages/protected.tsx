import { ReactNode } from "react";
import { Navigate } from "react-router";
import Error from "@/components/error";
import { useUserStore } from "@/stores/app-store";
import { useAuth } from "@/hooks/use-auth";
import Loader from "@/components/loader";

const Protected = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const { data: status, isLoading, isError } = useAuth();

  if (user) return children;

  if (isLoading) return <Loader/>;
  if (isError || status === "error") return <Error />;
  if (status === "unauthorized") return <Navigate to="/auth" />;

  return children;
};

export default Protected