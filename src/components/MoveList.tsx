import { useMovieStore } from "@/store/movie";
import ResultCard from "./ResultCard";
import { AnnoyedIcon, CatIcon, LoaderCircleIcon } from "lucide-react";

export function MoveList() {
  const { isLoading, movieList } = useMovieStore();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center mt-40 gap-5">
        <LoaderCircleIcon className="animate-spin size-10" />
        正在加载中...
      </div>
    );
  }

  if (!movieList) {
    return null;
  }

  if (movieList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 mt-40">
        <AnnoyedIcon className="size-10" />
        未找到相关视频，请尝试修改关键词后重试
      </div>
    );
  }

  return (
    <div className="overflow-hidden px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
      {movieList.map((item, index) => (
        <ResultCard
          key={`${item.vod_name}-${item.platformName}-${index}`}
          item={item as any}
          onClick={() => {
            //...
          }}
        />
      ))}
    </div>
  );
}
