import { create } from "zustand";

type Mode = "view" | "edit";

interface UserInfo {
  id: string;
  username: string;
  email: string;
}

interface UserState {
  mode: Mode;
  user: UserInfo | null;
  accessToken: string | null;
  setMode: (mode: Mode) => void;
  setUser: (user: UserInfo, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  mode: "view",
  user: null,
  accessToken: null,
  setMode: (mode) => set({ mode }),
  setUser: (user, token) => set({ user, accessToken: token }),
  clearUser: () => set({ user: null, accessToken: null, mode: "view" }),
}));
