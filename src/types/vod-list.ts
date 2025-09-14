export interface VodListItem {
  code: string;
  masg: string;
  page: number;
  pagecount: number;
  limit: number;
  total: number;
  list: VodItem[];
  class: VodClassItem[];
}

export interface VodItem {
  vod_id: string;
  vod_name: string;
  type_id: string;
  type_name: string;
  vod_en: string;
  vod_time: string;
  vod_remarks: string;
  vod_play_from: string;
}

export interface VodClassItem {
  type_id: string;
  type_pid: string;
  type_name: string;
}
