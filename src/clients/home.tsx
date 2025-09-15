"use client";

import Aurora from "@/components/Aurora";
import { Header } from "@/components/Header";
import { MoveList } from "@/components/MoveList";
import { PlatformList } from "@/components/PlatformList";
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
      <Aurora colorStops={["#7cff67", "#b19eef", "#5227ff"]} />

      <div className="absolute inset-0">
        <Header />
        <SearchForm />
        <MoveList />
      </div>
    </div>
  );
}
