// hooks/use-auth.ts
import { useQuery } from "@tanstack/react-query";
import { tryRefresh } from "@/lib/auth";

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: tryRefresh,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
