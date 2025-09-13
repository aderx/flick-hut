export interface SearchVideoSourceItem {
  name: string;
  url: string;
}

export interface SourceData {
  name: string;
  code: string;
  videoList: SearchVideoListItem[];
}

export interface SearchVideoListItem {
  source: SearchVideoSourceItem[];
  /** 视频封面 */
  vod_pic: string;
  /** 视频唯一标识符 */
  vod_id: number;
  /** 视频分类ID */
  type_id: number;
  /** 视频子分类ID */
  type_id_1: number;
  /** 视频分组ID */
  group_id: number;
  /** 视频名称 */
  vod_name: string;
  /** 视频副标题 */
  vod_sub: string;
  /** 视频英文名 */
  vod_en: string;
  /** 视频状态：0-禁用，1-启用 */
  vod_status: 0 | 1;
  /** 视频首字母 */
  vod_letter: string;
  /** 视频颜色标识 */
  vod_color: string;
  /** 视频标签 */
  vod_tag: string;
  /** 视频分类，以逗号分隔 */
  vod_class: string;
  /** 视频缩略图 */
  vod_pic_thumb: string;
  /** 视频幻灯片图 */
  vod_pic_slide: string;
  /** 视频截图 */
  vod_pic_screenshot: string | null;
  /** 主演 */
  vod_actor: string;
  /** 导演 */
  vod_director: string;
  /** 编剧 */
  vod_writer: string;
  /** 幕后/制作人员 */
  vod_behind: string;
  /** 视频简介 */
  vod_blurb: string;
  /** 视频备注信息（如：更新至第几集） */
  vod_remarks: string;
  /** 发布日期 */
  vod_pubdate: string;
  /** 总集数 */
  vod_total: number;
  /** 当前集数 */
  vod_serial: string;
  /** 电视台 */
  vod_tv: string;
  /** 更新周期 */
  vod_weekday: string;
  /** 地区 */
  vod_area: string;
  /** 语言 */
  vod_lang: string;
  /** 年份 */
  vod_year: string;
  /** 清晰度版本 */
  vod_version: string;
  /** 资源类型（如：正片、预告等） */
  vod_state: string;
  /** 作者 */
  vod_author: string;
  /** 跳转链接 */
  vod_jumpurl: string;
  /** 模板 */
  vod_tpl: string;
  /** 播放页模板 */
  vod_tpl_play: string;
  /** 下载页模板 */
  vod_tpl_down: string;
  /** 是否完结：0-连载中，1-已完结 */
  vod_isend: 0 | 1;
  /** 是否锁定：0-未锁定，1-已锁定 */
  vod_lock: 0 | 1;
  /** 视频等级 */
  vod_level: number;
  /** 版权：0-无版权，1-有版权 */
  vod_copyright: 0 | 1;
  /** 视频积分 */
  vod_points: number;
  /** 播放所需积分 */
  vod_points_play: number;
  /** 下载所需积分 */
  vod_points_down: number;
  /** 总点击量 */
  vod_hits: number;
  /** 日点击量 */
  vod_hits_day: number;
  /** 周点击量 */
  vod_hits_week: number;
  /** 月点击量 */
  vod_hits_month: number;
  /** 时长（分钟） */
  vod_duration: string;
  /** 顶数量 */
  vod_up: number;
  /** 踩数量 */
  vod_down: number;
  /** 评分 */
  vod_score: string;
  /** 总评分 */
  vod_score_all: number;
  /** 评分次数 */
  vod_score_num: number;
  /** 更新时间 */
  vod_time: string;
  /** 添加时间（时间戳） */
  vod_time_add: number;
  /** 人气更新时间 */
  vod_time_hits: number;
  /** 生成时间 */
  vod_time_make: number;
  /** 试看时长 */
  vod_trysee: number;
  /** 豆瓣ID */
  vod_douban_id: number;
  /** 豆瓣评分 */
  vod_douban_score: string;
  /** 来源URL */
  vod_reurl: string;
  /** 关联视频 */
  vod_rel_vod: string;
  /** 关联文章 */
  vod_rel_art: string;
  /** 访问密码 */
  vod_pwd: string;
  /** 密码访问链接 */
  vod_pwd_url: string;
  /** 播放密码 */
  vod_pwd_play: string;
  /** 播放密码链接 */
  vod_pwd_play_url: string;
  /** 下载密码 */
  vod_pwd_down: string;
  /** 下载密码链接 */
  vod_pwd_down_url: string;
  /** 详细内容描述 */
  vod_content: string;
  /** 播放源标识 */
  vod_play_from: string;
  /** 播放服务器组 */
  vod_play_server: string;
  /** 播放备注 */
  vod_play_note: string;
  /** 播放地址（集数$地址#集数$地址 格式） */
  vod_play_url: string;
  /** 下载来源 */
  vod_down_from: string;
  /** 下载服务器组 */
  vod_down_server: string;
  /** 下载备注 */
  vod_down_note: string;
  /** 下载地址 */
  vod_down_url: string;
  /** 是否包含分集剧情：0-否，1-是 */
  vod_plot: 0 | 1;
  /** 分集剧情名称 */
  vod_plot_name: string;
  /** 分集剧情详情 */
  vod_plot_detail: string;
  /** 分类名称 */
  type_name: string;
}
