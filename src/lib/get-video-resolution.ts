const getVideoResolution = async (url: string): Promise<string> => {
  const lowerCaseUrl = url.toLowerCase();
  if (lowerCaseUrl.endsWith(".m3u8")) {
    try {
      const response = await fetch(url);
      if (!response.ok) return "未知";
      const manifest = await response.text();
      const lines = manifest.split("\n");
      let bestResolution = { width: 0, height: 0 };
      for (const line of lines) {
        if (line.includes("RESOLUTION=")) {
          const match = line.match(/RESOLUTION=(\d+)x(\d+)/);
          if (match) {
            const width = parseInt(match[1], 10);
            const height = parseInt(match[2], 10);
            if (width * height > bestResolution.width * bestResolution.height) {
              bestResolution = { width, height };
            }
          }
        }
      }
      return bestResolution.width > 0 ? `${bestResolution.height}P` : "未知";
    } catch (error) {
      console.error("Failed to parse M3U8 for resolution:", url, error);
      return "获取失败";
    }
  } else if (lowerCaseUrl.endsWith(".mp4")) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve(`${video.videoHeight}P`);
        video.remove();
      };
      video.onerror = () => {
        resolve("获取失败");
        video.remove();
      };
      video.src = url;
    });
  } else {
    return "不支持";
  }
};
