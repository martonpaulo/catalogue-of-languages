import { create } from "zustand";
import { persist } from "zustand/middleware";

import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";

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
      name: "writing-system-store",
    }
  )
);
