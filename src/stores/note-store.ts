import { create } from "zustand";

type Mode = "view" | "edit";


interface NoteState {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useNoteStore = create<NoteState>(
  (set) => ({
     setMode: (mode) => set({ mode }),
      mode: "view",
  })
)
  
