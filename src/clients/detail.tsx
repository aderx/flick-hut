"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { useCustomSearchParams } from "@/hooks/use-custom-search-params";
import { fetchApi } from "@/lib/service";
import { useMovieStore } from "@/store/movie";
import { DetailAPIRes } from "@/types/detail";
import { AnnoyedIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DetailClient() {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const { currentMovie, isLoading, setCurrentMovie, setLoading } =
    useMovieStore();
  const { source } = currentMovie || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSource = source?.[currentIndex];

  useEffect(() => {
    handleInit();
  }, []);

  const handleInit = async () => {
    try {
      setLoading(true);

      const { videoInfo } = await fetchApi<DetailAPIRes>("/api/detail", {
        method: "post",
        body: JSON.stringify({
          platformCode: searchParams.get("code"),
          videoId: searchParams.get("id"),
        }),
      });

      let targetIndex = Number(searchParams.get("p")) || 0;

      if (!videoInfo.source[targetIndex]) {
        targetIndex = 0;
      }

      setCurrentMovie(videoInfo);
      setCurrentIndex(targetIndex);
    } catch (e) {
      toast.error((e as any)?.message || e);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center mt-40 gap-5">
        <LoaderCircleIcon className="animate-spin size-10" />
        正在加载中...
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 mt-40">
        <AnnoyedIcon className="size-10" />
        资源加载错误，请返回首页检索后重试
      </div>
    );
  }

  if (!source || source.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 mt-40">
        <AnnoyedIcon className="size-10" />
        暂无可播放资源，请稍后再试
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="mx-0 mb-10 md:mx-10">
        <div className="my-10 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">{currentMovie.vod_name}</h1>
          <p className="text-sm">
            <span>{currentMovie.platformName}</span>
            <span className="mx-2">|</span>
            <span>
              {currentSource?.name} / 共{source?.length}集
            </span>
          </p>
        </div>

        <VideoPlayer
          url={currentSource?.url || ""}
          title={currentSource?.name || ""}
        />

        <div className="grid mx-5 md:mx-0 grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {source &&
            source.map((video, index) => (
              <Button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSearchParams({ p: String(index) });
                }}
                variant={index === currentIndex ? "default" : "outline"}
                disabled={index === currentIndex}
                className="h-auto py-2 px-3 text-sm whitespace-normal text-left cursor-pointer"
              >
                {video.name}
              </Button>
            ))}
        </div>
      </div>
    </>
  );
}
