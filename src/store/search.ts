import { create } from "zustand";

interface SearchStore {
  searchPlatformList: { name: string; code: string }[];
  selectedPlatformMap: { [code in string]?: { name: string; code: string } };
  updateSearchPlatformList: (
    newPlatformList: { name: string; code: string }[]
  ) => void;
  updateSelectedPlatformMap: (platform: {
    [code in string]?: { name: string; code: string };
  }) => void;
  setSelectedPlatformMap: (map: {
    [code in string]?: { name: string; code: string };
  }) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchPlatformList: [],
  selectedPlatformMap: {},
  updateSearchPlatformList: (list) => set({ searchPlatformList: list }),
  updateSelectedPlatformMap: (platform) =>
    set((state) => ({
      selectedPlatformMap: {
        ...(state?.selectedPlatformMap || {}),
        ...platform,
      },
    })),
  setSelectedPlatformMap: (map) => set({ selectedPlatformMap: map }),
}));
