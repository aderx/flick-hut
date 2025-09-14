import { SearchVideoListItem } from ".";

export interface DetailAPIRes {
  videoInfo: SearchVideoListItem;
}

export interface DetailAPIReq {
  platformCode: string;
  videoId: string;
}
