import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { createContext } from "react";

interface User {
  id:string;
  username:string;
}


interface AuthContextType {
  user: User | null;
  isLoading:boolean;
  isError:boolean;
  error:Error | null;
  refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
  
}
export const AuthContext = createContext<AuthContextType | null>(null)