import { create } from "zustand";

import { NationType } from "@/types/nation";

interface NationsState {
  nations: NationType[];
  setNations: (nations: NationType[]) => void;
}

export const useNationsStore = create<NationsState>((set) => ({
  nations: [],
  setNations: (nations) => set({ nations }),
}));
