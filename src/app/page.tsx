import { headers } from "next/headers";
import HomeClient from "../clients/home";

async function getSiteConfig() {
  const header = await headers();
  const host = header.get("host");
  const protocol = process?.env?.NODE_ENV === "development" ? "http" : "https";
  const response = await fetch(`${protocol}://${host}/api/config`);
  if (!response.ok) {
    return {};
  }
  return response.json();
}

export default async function Home() {
  const siteConfig = await getSiteConfig();

  // 设置背景图片URL
  // const backgroundImageUrl =
  //   typeof window !== "undefined"
  //     ? window.innerWidth <= 768
  //       ? siteConfig.phone_background_image_url
  //       : siteConfig.pc_background_image_url
  //     : siteConfig.pc_background_image_url;

  return <HomeClient siteConfig={siteConfig} />;
}
