import { create } from "zustand";
import { persist } from "zustand/middleware";

import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";
import { buildStorageKey } from "@/shared/utils/localStorageUtils";

interface WritingSystemState {
  writingSystems: WritingSystemType[];
  setWritingSystems: (writingSystems: WritingSystemType[]) => void;
}

export const useWritingSystemStore = create<WritingSystemState>()(
  persist(
    (set) => ({
      writingSystems: [],
      setWritingSystems: (writingSystems) => set({ writingSystems }),
    }),
    {
      name: buildStorageKey("writing-system-store"),
    }
  )
);
