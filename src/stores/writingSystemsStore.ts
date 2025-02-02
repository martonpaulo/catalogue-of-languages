import { create } from "zustand";

import { WritingSystemType } from "@/types/writingSystem";

interface WritingSystemsState {
  writingSystems: WritingSystemType[];
  setWritingSystems: (writingSystems: WritingSystemType[]) => void;
}

export const useWritingSystemsStore = create<WritingSystemsState>((set) => ({
  writingSystems: [],
  setWritingSystems: (writingSystems) => set({ writingSystems }),
}));
