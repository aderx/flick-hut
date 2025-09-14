import { getConfig } from "@/lib/service/config";
import { getVodList } from "@/lib/service/get-Vod-list";
import { SearchAPIReq } from "@/types/search";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { keyword, platformCodeList } = (await request.json()) as SearchAPIReq;

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }

  const config = getConfig();
  let sourceList = config.platformList;

  if (platformCodeList) {
    const findSouceList = platformCodeList
      .map((code) => sourceList.find((item) => item.code === code))
      .filter(Boolean) as typeof sourceList;

    if (findSouceList.length === 0) {
      return NextResponse.json(
        { error: "数据异常，平台码无效" },
        { status: 400 }
      );
    }

    sourceList = findSouceList;
  }

  try {
    // 并行处理所有源
    const promises = sourceList.map(async (source) => {
      try {
        return await getVodList({
          platfromCode: source.code,
          vodParams: { keyword },
        });
      } catch (e) {
        console.log("资源请求失败", { e, source, keyword });
        return [];
      }
    });

    const res = await Promise.all(promises);
    const searchList = res.flat(1).filter(Boolean);

    return NextResponse.json({ message: "检索完成", searchList });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
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
