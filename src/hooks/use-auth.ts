import api from "@/lib/api"
import { useUserStore } from "@/stores/user-store"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios";

export const useAuthUser = () => {
 const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.clearUser);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () =>
  api
    .get("/auth/me")
    .then((res) => {
      const user = res.data;
      setUser(user);
      return user;
    })
    .catch((e:AxiosError) => {
      logout();
      throw e
    }),
    enabled: !user, // Si on a déjà le user, on évite l'appel inutile
    staleTime: 1000 * 60 * 15,
    retry: false,
    refetchOnWindowFocus:false
  });
}