"use client";

import { Dither } from "@/components/effects/Dither";
import { LiquidGlass } from "@/components/effects/LiquidGlass";
import { Header } from "@/components/Header";
import { MoveList } from "@/components/MoveList";
import SearchForm from "@/components/SearchForm";
import { fetchApi } from "@/lib/service";
import { useSearchStore } from "@/store/search";
import { SiteConfig } from "@/types/config";
import { useEffect } from "react";
import { toast } from "sonner";

export default function HomeClient() {
  const { updateSearchPlatformList } = useSearchStore();

  useEffect(() => {
    handleInit();
  }, []);

  const handleInit = async () => {
    try {
      const { platformList } = await fetchApi<SiteConfig>("/api/config");

      updateSearchPlatformList(platformList);
    } catch (e) {
      toast.error((e as any)?.message || e);
    }
  };

  return (
    <div className="w-screen h-screen">
      <LiquidGlass width={300} height={200} />
      <Dither />

      <div className="absolute inset-0">
        {/* <Header /> */}

        <SearchForm />
        <MoveList />
      </div>
    </div>
  );
}
