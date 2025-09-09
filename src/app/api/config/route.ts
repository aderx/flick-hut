import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 定义数据结构
interface BaseUrlItem {
  name: string;
  base_url: string;
}

interface SiteConfig {
  site_name: string;
  pc_background_image_url: string;
  phone_background_image_url: string;
  timeout: number;
  base_urls: BaseUrlItem[];
}

// 读取配置文件
export function getConfig(): SiteConfig {
  const configPath = path.join(process.cwd(), "config.json");
  const rawData = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(rawData);
}

// 更新配置文件
export function updateConfig(newConfig: SiteConfig): void {
  const configPath = path.join(process.cwd(), "config.json");
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), "utf-8");
}

export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read config file" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newConfig = await request.json();
    updateConfig(newConfig);
    return NextResponse.json({
      message: "Configuration updated and saved successfully.",
      current_config: newConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update config file" },
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