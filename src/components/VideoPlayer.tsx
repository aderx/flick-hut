import { Option } from "artplayer";
import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  url: string;
  cover: string;
  onNextEpisode?: () => void; // 添加下一集回调
  hasNextEpisode?: boolean; // 是否有下一集
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  cover,
  onNextEpisode,
  hasNextEpisode,
}) => {
  const artRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoNext, setAutoNext] = useState(() => {
    // 从 localStorage 读取自动切集设置，默认为 true
    const saved = localStorage.getItem("video-autonext");
    return saved !== null ? saved === "true" : true;
  });

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

      // 自定义控制按钮 - 下一集
      const nextEpisodeControl = {
        name: "next",
        position: "left",
        index: 15,
        html: '<svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" viewBox="0 0 22 22"><path d="M16 5a1 1 0 00-1 1v4.615a1.431 1.431 0 00-.615-.829L7.21 5.23A1.439 1.439 0 005 6.445v9.11a1.44 1.44 0 002.21 1.215l7.175-4.555a1.436 1.436 0 00.616-.828V16a1 1 0 002 0V6C17 5.448 16.552 5 16 5z"></path></svg>',
        tooltip: "下一集",
        click: function () {
          onNextEpisode?.();
        },
      };

      const options: Option = {
        container: containerRef.current,
        url,
        lang: "zh-cn",
        poster: cover,
        autoplay: true,
        autoSize: false,
        autoMini: true,
        setting: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        lock: true,
        fastForward: true,
        autoOrientation: true,
        hotkey: true, // 启用快捷键
        controls: hasNextEpisode ? [nextEpisodeControl] : [], // 根据是否有下一集来添加控件
        settings: [
          {
            html: "自动切集",
            tooltip: autoNext ? "开启" : "关闭",
            switch: autoNext,
            onSwitch: function (item: any) {
              const nextState = !item.switch;
              localStorage.setItem("video-autonext", nextState.toString());
              setAutoNext(nextState);
              item.tooltip = nextState ? "开启" : "关闭";
              return nextState;
            },
          },
          {
            width: 200,
            html: "画质",
            selector: [{ html: "自动", default: true }],
          },
        ],
      };

      const lowerCaseUrl = url.toLowerCase();
      if (lowerCaseUrl.endsWith(".m3u8")) {
        options.type = "m3u8";
        options.customType = { m3u8: playM3u8 };
      }

      // 销毁旧的播放器实例
      artRef.current?.destroy();

      // 创建新的播放器实例
      const art = new (Artplayer as any)(options);
      artRef.current = art;

      // 记忆播放进度
      const videoKey = `video-progress-${url}`;
      const savedTime = localStorage.getItem(videoKey);
      if (savedTime) {
        art.currentTime = parseFloat(savedTime);
      }

      // 每5秒保存一次播放进度
      const saveProgressInterval = setInterval(() => {
        localStorage.setItem(videoKey, art.currentTime.toString());
      }, 5000);

      // 视频结束时根据设置决定是否自动播放下一集
      art.on("ended", () => {
        if (hasNextEpisode && autoNext) {
          art.notice.show = "即将播放下一集...";
          // 延迟 2 秒切换到下一集，给用户取消的机会
          const timer = setTimeout(() => {
            onNextEpisode?.();
          }, 2000);

          // 如果用户在这 2 秒内开始播放，则取消自动切集
          const cancelAutoNext = () => {
            clearTimeout(timer);
            art.off("play", cancelAutoNext);
          };
          art.on("play", cancelAutoNext);
        }
      });

      art.on("ready", () => {
        const closeBtn = document.getElementById("closeModal");
        if (closeBtn) closeBtn.style.display = "none";
      });

      // 清理函数
      return () => {
        clearInterval(saveProgressInterval);
      };
    };

    initArtPlayer();

    return () => {
      if (artRef.current) {
        // 销毁前保存进度
        const videoKey = `video-progress-${url}`;
        localStorage.setItem(videoKey, artRef.current.currentTime.toString());

        artRef.current.destroy();
        artRef.current = null;
      }
    };
  }, [url, cover, autoNext]);

  return (
    <div ref={containerRef} className="w-full h-[40vh] md:h-[500px] my-10" />
  );
};

export default VideoPlayer;
