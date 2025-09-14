export function getVodUrl(
  url: string,
  params: {
    urlType?: "list" | "detail";
    // 类别ID
    typeId?: string;
    // 页码
    pageNo?: number;
    // 关键词
    keyword?: string;
    // 最近几个小时内的数据
    hour?: number;
    // 视频唯一标识符
    idList?: number[];
  }
) {
  const { urlType = "detail", idList, typeId, pageNo, keyword, hour } = params;

  return [
    url,
    urlType === "detail" ? "?ac=detail" : "?ac=list",
    idList ? `&ids=${idList.join(",")}` : "",
    typeId ? `&t=${typeId}` : "",
    pageNo ? `&pg=${pageNo}` : "",
    keyword ? `&wd=${keyword}` : "",
    hour ? `&h=${hour}` : "",
  ].join("");
}
