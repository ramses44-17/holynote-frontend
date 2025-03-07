import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import axios from "axios";

const Protected = ({ children }: { children: ReactNode }) => {
  // const { isError, error } = useAuth();
  // if (isError) {
  //   if (axios.isAxiosError(error)) {
  //     if (error.response?.status === 500) {
  //       return (
  //         <div className="flex items-center justify-center min-h-screen flex-col">
  //           <h1 className="text-3xl font-bold text-red-500 mb-4">Erreur 500</h1>
  //           <p className="text-lg text-gray-700">
  //             Oups ! Une erreur interne est survenue.
  //           </p>
  //         </div>
  //       );
  //     }
  //     if (error.response?.status === 401) {
  //       return <Navigate to="/login" />;
  //     }
  //   }
  //   return <Navigate to="/login" />;
  // }

  return children;
};

export default Protected;
