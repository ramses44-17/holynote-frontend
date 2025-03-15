import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import axios from "axios";
import Error from "@/components/error";

const Protected = ({ children }: { children: ReactNode }) => {
  const { isError, error } = useAuth();
  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return <Navigate to="/auth" />;
      }
    }
    return <Error/>;
  }
  return children;
};

export default Protected;
