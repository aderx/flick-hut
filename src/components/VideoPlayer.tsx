import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const artRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initArtPlayer = async () => {
      if (!url || !containerRef.current) return;

      // 动态导入ArtPlayer以避免SSR问题
      const Artplayer = (await import("artplayer")).default;
      const Hls = (await import("hls.js")).default;

      const playM3u8 = (video: HTMLVideoElement, url: string, art: any) => {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy();
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          art.hls = hls;
          art.on("destroy", () => hls.destroy());
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else {
          art.notice.show = "Unsupported playback format: m3u8";
        }
      };

      const options: any = {
        container: containerRef.current,
        url: url,
        title: title,
        autoplay: true,
        autoSize: false,
        setting: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
      };

      const lowerCaseUrl = url.toLowerCase();
      if (lowerCaseUrl.endsWith(".m3u8")) {
        options.type = "m3u8";
        options.customType = { m3u8: playM3u8 };
      }

      artRef.current = new (Artplayer as any)(options);

      artRef.current.on("ready", () => {
        const closeBtn = document.getElementById("closeModal");
        if (closeBtn) closeBtn.style.display = "none";
      });
    };

    initArtPlayer();

    return () => {
      if (artRef.current) {
        artRef.current.destroy();
        artRef.current = null;
      }
    };
  }, [url, title]);

  return (
    <div ref={containerRef} className="w-full h-[40vh] md:h-[500px] my-10" />
  );
};

export default VideoPlayer;
