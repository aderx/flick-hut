import { getConfig, updateConfig } from "@/lib/service/config";
import { NextResponse } from "next/server";

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
