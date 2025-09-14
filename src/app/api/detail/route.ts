import { getConfig } from "@/lib/service/config";
import { getVodList } from "@/lib/service/get-Vod-list";
import { DetailAPIReq } from "@/types/detail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { platformCode, videoId } = (await request.json()) as DetailAPIReq;

  if (!platformCode) {
    return NextResponse.json(
      { error: "缺少必须的字段：平台码" },
      { status: 400 }
    );
  }

  if (!videoId) {
    return NextResponse.json(
      { error: "缺少必须的字段：视频索引" },
      { status: 400 }
    );
  }

  const config = getConfig();
  const platform = config.platformList.find((p) => p.code === platformCode);

  if (!platform) {
    return NextResponse.json(
      { error: "数据异常，平台码无效" },
      { status: 400 }
    );
  }

  try {
    const videoList = await getVodList({
      platfromCode: platform.code,
      vodParams: { idList: [Number(videoId)] },
    });

    return NextResponse.json({
      message: "成功获取视频详情",
      videoInfo: videoList?.[0],
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
