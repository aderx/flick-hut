import { create } from "zustand";

export const defaultPlatform = {
  name: "聚合",
  code: "_UNION_",
};

interface SearchStore {
  searchPlatformList: { name: string; code: string }[];
  selectedPlatform?: string;
  updateSearchPlatformList: (
    newPlatformList: { name: string; code: string }[]
  ) => void;
  setSelectedPlatform: (platform: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchPlatformList: [defaultPlatform],
  updateSearchPlatformList: (list) => {
    const newList = [defaultPlatform, ...list];

    set((state) => ({
      searchPlatformList: newList,
      selectedPlatform: state.selectedPlatform || newList[0].code,
    }));
  },
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
}));
