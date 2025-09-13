export interface SiteConfig {
  timeout?: number;
  platformList: SiteBasePlatformListItem[];
}

export interface SiteBasePlatformListItem {
  name: string;
  code: string;
  url: string;
}
