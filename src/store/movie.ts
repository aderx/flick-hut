import { create } from "zustand";

export interface MovieListItem {
  name: string;
  platform: string;
  coverUrl: string;
  resolution: string;
  list: { name: string; url: string }[];
}

interface MovieStore {
  movieList: MovieListItem[];
  currentMovie?: MovieListItem;
  setCurrentMovie: (movie: MovieListItem) => void;
  setMovieList: (list: MovieListItem[]) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  movieList: [],
  setMovieList: (list) => set({ movieList: list }),
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
}));
