"use client";

import Aurora from "@/components/Aurora";
import EpisodeModal from "@/components/EpisodeModal";
import { Header } from "@/components/Header";
import { MoveList } from "@/components/MoveList";
import { PlatformList } from "@/components/PlatformList";
import ResultCard from "@/components/ResultCard";
import SearchForm from "@/components/SearchForm";
import VideoPlayer from "@/components/VideoPlayer";
import { fetchApi } from "@/lib/service";
import { useMovieStore } from "@/store/movie";
import { useSearchStore } from "@/store/search";
import { SearchVideoListItem, SourceData } from "@/types";
import { SiteConfig } from "@/types/config";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function HomeClient() {
  const { updateSearchPlatformList } = useSearchStore();
  const { updateMovieList } = useMovieStore();
  const [episodesModalVisible, setEpisodesModalVisible] = useState(false);
  const [selectedItemForEpisodes, setSelectedItemForEpisodes] =
    useState<SearchVideoListItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    handleInit();
  }, []);

  const handleInit = async () => {
    try {
      const { platformList } = await fetchApi<SiteConfig>("/api/config");

      updateSearchPlatformList(platformList);
    } catch (e) {
      toast.error((e as any)?.message || e);
    }
  };

  const startSearch = (keyword: string) => {
    if (eventSource) {
      eventSource.close();
    }

    // 使用新的API路由
    const url = `/api/search?keyword=${encodeURIComponent(keyword)}`;
    const newEventSource = new EventSource(url);
    setEventSource(newEventSource);

    newEventSource.onmessage = async (event) => {
      const sourceData = JSON.parse(event.data) as SourceData;
      if (
        !sourceData ||
        !sourceData.videoList ||
        sourceData.videoList.length === 0
      ) {
        return;
      }

      const { videoList } = sourceData;

      updateMovieList(videoList);
    };

    newEventSource.onerror = () => {
      toast("搜索完成");
      newEventSource.close();
    };
  };

  const showEpisodes = (item: SearchVideoListItem) => {
    if (!item.source || item.source.length === 0) {
      toast("该项目没有可播放的视频源");
      // setIsStatusVisible(true);
      // setTimeout(() => {
      //   setIsStatusVisible(false);
      // }, 2000);
      return;
    }
    setSelectedItemForEpisodes(item);
    setEpisodesModalVisible(true);
  };

  const closeEpisodesModal = () => {
    setEpisodesModalVisible(false);
  };

  const playVideo = (url: string, title: string) => {
    closeEpisodesModal(); // Close episode selector before playing

    const lowerCaseUrl = url.toLowerCase();
    if (!lowerCaseUrl.endsWith(".m3u8") && !lowerCaseUrl.endsWith(".mp4")) {
      window.open(url, "_blank");
      return;
    }

    setVideoUrl(url);
    setVideoTitle(title);
    setModalVisible(true);
  };

  const closeVideoModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  return (
    <div className="w-screen h-screen">
      <Aurora colorStops={["#7cff67", "#b19eef", "#5227ff"]} />

      <div className="absolute inset-0">
        <Header />
        <SearchForm onSearch={startSearch} />
        <PlatformList />
        <MoveList />

        <EpisodeModal
          isVisible={episodesModalVisible}
          selectedItem={selectedItemForEpisodes}
          onClose={closeEpisodesModal}
          onPlay={playVideo}
        />

        <VideoPlayer
          url={videoUrl}
          title={videoTitle}
          isVisible={modalVisible}
          onClose={closeVideoModal}
        />
      </div>
    </div>
  );
}
