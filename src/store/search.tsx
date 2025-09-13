import { create } from "zustand";

interface SearchStore {
  searchPlatformList: { name: string; code: string }[];
  selectedPlatform?: string;
  updateSearchPlatformList: (
    newPlatformList: { name: string; code: string }[]
  ) => void;
  setSelectedPlatform: (platform: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchPlatformList: [],
  updateSearchPlatformList: (list) =>
    set({
      searchPlatformList: list,
      selectedPlatform: list.length > 0 ? list[0].code : undefined,
    }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
}));
