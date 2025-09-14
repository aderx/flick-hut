import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMovieStore } from "@/store/movie";
import React, { useState } from "react";
import { toast } from "sonner";

interface SearchFormProps {
  onSearch: (keyword: string) => void;
}
const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const { isLoading, movieList } = useMovieStore();
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword) {
      toast("请输入关键字");
      return;
    }

    if (keyword.trim()) {
      onSearch(keyword);
    }
  };

  return (
    <div
      className={cn("mx-10 my-5 flex gap-5", {
        "mt-[300px]": !movieList && !isLoading,
      })}
    >
      <Input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="请输入关键词..."
        className="h-14 md:text-xl rounded-full px-5"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />

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
