import { SearchVideoListItem } from "@/types";
import { create } from "zustand";

interface MovieStore {
  movieList?: SearchVideoListItem[];
  currentMovie?: SearchVideoListItem;
  isLoading: boolean;
  setCurrentMovie: (movie: SearchVideoListItem) => void;
  updateMovieList: (list: SearchVideoListItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  isLoading: false,
  updateMovieList: (list) =>
    set((state) => ({ movieList: [...(state.movieList || []), ...list] })),
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
