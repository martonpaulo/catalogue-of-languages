import { create } from "zustand";

import { WritingSystemType } from "@/types/writingSystem";

interface WritingSystemStore {
  writingSystems: WritingSystemType[];
  setWritingSystems: (writingSystems: WritingSystemType[]) => void;
}

export const useWritingSystemStore = create<WritingSystemStore>((set) => ({
  writingSystems: [],
  setWritingSystems: (writingSystems) => set({ writingSystems }),
}));
