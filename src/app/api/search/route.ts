import { NextResponse } from "next/server";
import { getConfig } from "../config/route";
import { SourceData } from "@/types";
import { SiteBasePlatformListItem, SiteConfig } from "@/types/config";

interface Video {
  name: string;
  video_url: string;
}

// 解析CMS数据
function parseCmsData(
  sourceName: string,
  sourceCode: string,
  cmsList: any[]
): SourceData {
  const results: SourceData["videoList"] = [];

  for (const item of cmsList) {
    // vod_play_url 的格式通常是 '播放源1$$$播放源2'
    // 我们只取第一个播放源
    const playUrlsStr = item.vod_play_url?.split("$$$")[0] || "";

    const source: Video[] = [];
    // 视频列表以 '#' 分割
    const episodes = playUrlsStr.split("#");
    for (const episode of episodes) {
      // 每一集是 '剧集名$播放链接'
      const parts = episode.split("$");
      if (parts.length === 2) {
        const videoName = parts[0];
        const videoUrl = parts[1];
        source.push({ name: videoName, video_url: videoUrl });
      }
    }

    // 只有当成功解析出视频时才添加该条目
    if (source.length > 0) {
      results.push({
        ...item,
        source: source,
      });
    }
  }

  return {
    name: sourceName,
    code: sourceCode,
    videoList: results,
  };
}

// 获取并处理单个API源的数据
async function fetchAndProcess(
  source: SiteBasePlatformListItem,
  keyword: string,
  timeout: number,
  stream: WritableStreamDefaultWriter
): Promise<void> {
  const { name, code, url } = source;
  const sourceUrl = `${url}?ac=detail&wd=${encodeURIComponent(keyword)}`;

  try {
    // console.log(`开始搜索: ${name} -> ${url}`);

    // 设置超时
    const response = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(timeout * 1000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const data = await response.json();

    if (data.code === 1 && data.list && data.list.length > 0) {
      console.log(`成功: ${name}`);
      const result = parseCmsData(name, code, data.list);
      // 通过SSE发送结果
      const dataString = `data: ${JSON.stringify(result)}\n\n`;
      const encoder = new TextEncoder();
      await stream.write(encoder.encode(dataString));
    } else {
      console.log(`数据为空或格式错误: ${name}, message: ${data.msg}`);
    }
  } catch (error) {
    console.log(`请求或处理时发生错误: ${name}, 错误: ${error}`);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }

  // 创建可读流
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // 设置响应头
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // 异步处理搜索请求
  (async () => {
    try {
      const config = getConfig();
      const sources = config.platformList;
      const timeout = config.timeout;

      // 并行处理所有源
      const promises = sources.map((source) =>
        fetchAndProcess(source, keyword, timeout || 5, writer)
      );

      await Promise.all(promises);

      // 结束响应
      await writer.close();
    } catch (error) {
      console.error("Search error:", error);
      const errorString = `data: ${JSON.stringify({
        error: "搜索过程中发生错误",
      })}\n\n`;
      await writer.write(encoder.encode(errorString));
      await writer.close();
    }
  })();

  return new NextResponse(stream.readable, { headers });
}

// 处理预检请求
export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Length": "0",
  };

  return new NextResponse(null, { status: 204, headers });
}
