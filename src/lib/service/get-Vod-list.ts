import { getConfig } from "./config";
import { getVodUrl, GetVodUrlParams } from "./get-vod-url";
import { parseVodData } from "./parse-vod-data";

export async function getVodList(params: {
  vodParams: GetVodUrlParams;
  platfromCode?: string;
}) {
  const { vodParams, platfromCode } = params;
  const config = getConfig();
  const { timeout = 10, platformList } = config;

  const source = platformList.find((item) => item.code === platfromCode);
  if (!source) {
    throw new Error("数据异常，平台码无效");
  }

  const { name, code, url } = source;
  const sourceUrl = getVodUrl(url, vodParams);

  try {
    // 设置超时
    const response = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(timeout * 1000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const data = await response.json();

    if (data.code === 1 && data.list) {
      return parseVodData(name, code, data.list);
    } else {
      throw new Error(`数据格式错误: ${name}, message: ${data.msg}`);
    }
  } catch (error) {
    console.log(`请求或处理时发生错误: ${name}, 错误: ${error}`);
  }
}
