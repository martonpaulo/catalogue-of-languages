import { create } from "zustand";

import { NationType } from "@/types/nation";

interface NationStore {
  nations: NationType[];
  setNations: (nations: NationType[]) => void;
}

export const useNationStore = create<NationStore>((set) => ({
  nations: [],
  setNations: (nations) => set({ nations }),
}));
