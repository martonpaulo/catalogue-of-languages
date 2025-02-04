import { create } from "zustand";

interface LanguageState {
  lastOffset?: string;
  setLastOffset: (offset: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lastOffset: undefined,
  setLastOffset: (offset) => set({ lastOffset: offset }),
}));
