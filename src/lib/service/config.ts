import fs from "fs";
import path from "path";
import { SiteConfig } from "@/types/config";

let loadedConfig: SiteConfig;

// 读取配置文件
export function getConfig() {
  if (loadedConfig) {
    return loadedConfig;
  }

  const configPath = path.join(process.cwd(), "config.json");
  const rawData = fs.readFileSync(configPath, "utf-8");

  loadedConfig = JSON.parse(rawData);
  return loadedConfig;
}

// 更新配置文件
export function updateConfig(newConfig: SiteConfig) {
  const configPath = path.join(process.cwd(), "config.json");
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), "utf-8");
  loadedConfig = newConfig;
}
