import axios from "axios";
import { useUserStore } from "@/stores/user-store";
import { apiBaseUrl } from "./utils";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: ((tokenRefreshed: boolean) => void)[] = [];
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        try {
          await axios.post(
            `${apiBaseUrl}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          if (!originalRequest.url?.includes("/auth/me")) {
            try {
              const { data } = await api.get("/auth/me");
              useUserStore.getState().setUser(data);
            } catch (err) {
               console.warn("Impossible de recharger l'utilisateur :", err);
            }
          }
          isRefreshing = false;
          refreshQueue.forEach((cb) => cb(true));
          refreshQueue = [];
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshQueue.forEach((cb) => cb(false));
          refreshQueue = [];
          useUserStore.getState().clearUser();
          return Promise.reject(refreshError);
        }
      }
      return new Promise((resolve, reject) => {
        refreshQueue.push((tokenRefreshed: boolean) => {
          if (tokenRefreshed) {
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api