import { SearchVideoSourceItem, SourceData } from "@/types";
import { VodDetailListItem } from "@/types/vod-detail";

// 解析CMS数据
export function parseVodData(
  sourceName: string,
  sourceCode: string,
  cmsList: VodDetailListItem[]
): SourceData {
  const results: SourceData["videoList"] = [];

  for (const item of cmsList) {
    // vod_play_url 的格式通常是 '播放源1$$$播放源2'
    // 我们只取第一个播放源
    const playUrlsStr = item.vod_play_url?.split("$$$")[0] || "";

    const source: SearchVideoSourceItem[] = [];
    // 视频列表以 '#' 分割
    const episodes = playUrlsStr.split("#");
    for (const episode of episodes) {
      // 每一集是 '剧集名$播放链接'
      const parts = episode.split("$");
      if (parts.length === 2) {
        const videoName = parts[0];
        const videoUrl = parts[1];
        source.push({ name: videoName, url: videoUrl });
      }
    }

    // 只有当成功解析出视频时才添加该条目
    if (source.length > 0) {
      results.push({
        ...item,
        source: source,
        platformCode: sourceCode,
        platformName: sourceName,
      });
    }
  }

  return {
    name: sourceName,
    code: sourceCode,
    videoList: results,
  };
}
