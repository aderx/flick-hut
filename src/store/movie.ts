import { SearchVideoListItem } from "@/types";
import { create } from "zustand";

interface MovieStore {
  movieList: SearchVideoListItem[];
  currentMovie?: SearchVideoListItem;
  setCurrentMovie: (movie: SearchVideoListItem) => void;
  updateMovieList: (list: SearchVideoListItem[]) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  movieList: [],
  updateMovieList: (list) =>
    set((state) => ({ movieList: [...state.movieList, ...list] })),
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
}));
