import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useCustomSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 创建一个新的 URLSearchParams 实例，方便操作
  const params = new URLSearchParams(searchParams.toString());

  // 更新查询参数但不刷新页面
  const setSearchParams = (updates: Record<string, string>) => {
    // 更新参数
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // 使用 replace 方法更新 URL，{ scroll: false } 防止页面滚动
    const search = params.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  return { searchParams: params, setSearchParams };
}
