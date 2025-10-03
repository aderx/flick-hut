import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/service";
import { cn } from "@/lib/utils";
import { useMovieStore } from "@/store/movie";
import { SearchAPIRes } from "@/types/search";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { PlatformList } from "./PlatformList";
import { useSearchStore } from "@/store/search";
import { CircleArrowRight } from "lucide-react";

const SearchForm = () => {
  const { selectedPlatformMap } = useSearchStore();
  const { setMovieList, setLoading } = useMovieStore();
  const [keyword, setKeyword] = useState("");

  const selctedPlatformList = useMemo(() => {
    return Object.values(selectedPlatformMap).filter(Boolean);
  }, [selectedPlatformMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword) {
      toast("请输入关键字");
      return;
    }

    setLoading(true);

    try {
      const { searchList } = await fetchApi<SearchAPIRes>("/api/search", {
        method: "post",
        body: JSON.stringify({
          keyword,
          platformCodeList: selctedPlatformList.map((item) => item?.code),
        }),
      });

      setMovieList(searchList || []);
    } catch (error) {
      toast.error((error as any)?.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-10 my-5 flex gap-5">
      <div className="relative w-full">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="请输入关键词..."
          className="h-14 md:text-xl rounded-full pl-5 pr-5 md:pr-40 flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />

        <PlatformList />
        <CircleArrowRight />
      </div>

      <Button
        className="h-13 rounded-full w-20 text-xl cursor-pointer"
        onClick={handleSubmit}
      >
        搜索
      </Button>
    </div>
  );
};

export default SearchForm;
