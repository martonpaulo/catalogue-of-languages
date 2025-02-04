import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LanguageType } from "@/features/languages/types/language.type";
import { buildStorageKey } from "@/shared/utils/localStorageUtils";

interface LanguageState {
  lastOffset?: string;
  languages: LanguageType[];
  setLastOffset: (offset: string) => void;
  setLanguages: (languages: LanguageType[]) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lastOffset: undefined,
      languages: [],
      setLastOffset: (offset) => set({ lastOffset: offset }),
      setLanguages: (languages) => set({ languages }),
    }),
    {
      name: buildStorageKey("language-store"),
    }
  )
);
