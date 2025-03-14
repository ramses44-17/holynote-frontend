import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import axios from "axios";

const Protected = ({ children }: { children: ReactNode }) => {
  const { isError, error } = useAuth();
  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return <Navigate to="/auth" />;
      }
    }
    return <Navigate to="/auth" />;
  }
  return children;
};

export default Protected;
