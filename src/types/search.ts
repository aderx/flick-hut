import { SearchVideoListItem } from ".";

export interface SearchAPIRes {
  searchList: SearchVideoListItem[];
}

export interface SearchAPIReq {
  keyword: string;
  platformCodeList: string[];
}
