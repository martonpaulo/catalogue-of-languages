import { create } from "zustand";
import { persist } from "zustand/middleware";

import { NationType } from "@/features/nations/types/nation.type";
import { buildStorageKey } from "@/shared/utils/localStorageUtils";

interface NationState {
  nations: NationType[];
  setNations: (nations: NationType[]) => void;
}

export const useNationStore = create<NationState>()(
  persist(
    (set) => ({
      nations: [],
      setNations: (nations) => set({ nations }),
    }),
    {
      name: buildStorageKey("nation-store"),
    }
  )
);
