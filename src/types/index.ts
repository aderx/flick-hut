import { VodDetailListItem } from "./vod-detail";

export interface SearchVideoSourceItem {
  name: string;
  url: string;
}

export interface SourceData {
  name: string;
  code: string;
  videoList: SearchVideoListItem[];
}

export interface SearchVideoListItem extends VodDetailListItem {
  platformName: string;
  platformCode: string;
  source: SearchVideoSourceItem[];
}
