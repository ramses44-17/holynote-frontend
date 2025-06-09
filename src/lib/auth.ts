import axios from "axios";
import { useUserStore } from "@/stores/app-store";
import { apiBaseUrl } from "@/lib/utils";
import { AuthResponse } from "@/types/types";

export const tryRefresh = async (): Promise<"success" | "unauthorized" | "error"> => {
  const { setUser } = useUserStore.getState();

  try {
    const res = await axios.post<AuthResponse>(`${apiBaseUrl}/auth/refresh`, {}, {
      withCredentials: true,
    });

    const { user, accessToken } = res.data;
    setUser(user, accessToken);
    return "success";
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const code = err.response.status;
      if (code === 401 || code === 403) return "unauthorized";
    }
    return "error";
  }
};
