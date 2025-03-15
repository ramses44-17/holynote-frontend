import { create } from "zustand";

type Mode = "view" | "edit";

interface UserState {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useUserStore = create<UserState>((set) => ({
  mode: "view",
  setMode: (mode) => set({ mode }),
}));
