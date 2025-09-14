"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { useCustomSearchParams } from "@/hooks/use-custom-search-params";
import { fetchApi } from "@/lib/service";
import { useMovieStore } from "@/store/movie";
import { DetailAPIRes } from "@/types/detail";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DetailClient() {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const { currentMovie, setCurrentMovie } = useMovieStore();
  const { source } = currentMovie || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSource = source?.[currentIndex];

  useEffect(() => {
    handleInit();
  }, []);

  const handleInit = async () => {
    try {
      const { videoInfo } = await fetchApi<DetailAPIRes>("/api/detail", {
        method: "post",
        body: JSON.stringify({
          platformCode: searchParams.get("code"),
          videoId: searchParams.get("id"),
        }),
      });

      setCurrentMovie(videoInfo);
      setCurrentIndex(Number(searchParams.get("p")) || 0);
    } catch (e) {
      toast.error((e as any)?.message || e);
    }
  };

  if (!currentMovie) {
    return null;
  }

  if (!source || source.length === 0) {
    return <div>暂无可播放资源，请稍后再试</div>;
  }

  return (
    <>
      <Header />

      <div className="mx-10 mb-10">
        <div className="my-5">
          <h1 className="text-2xl font-bold my-5">{currentMovie.vod_name}</h1>
          <p></p>
        </div>

        <VideoPlayer
          url={currentSource?.url || ""}
          title={currentSource?.name || ""}
        />

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
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
