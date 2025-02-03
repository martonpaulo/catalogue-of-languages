import { create } from "zustand";

interface LanguageStore {
  lastOffset?: string;
  setLastOffset: (offset: string) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  lastOffset: undefined,
  setLastOffset: (offset) => set({ lastOffset: offset }),
}));
