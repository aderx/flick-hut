import { useMovieStore } from "@/store/movie";
import ResultCard from "./ResultCard";

export function MoveList() {
  const { movieList } = useMovieStore();

  return (
    <div className="overflow-hidden px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
      {movieList.map((item, index) => (
        <ResultCard
          key={`${item.name}-${item.platform}-${index}`}
          item={item as any}
          onClick={() => {
            //...
          }}
        />
      ))}
    </div>
  );
}
