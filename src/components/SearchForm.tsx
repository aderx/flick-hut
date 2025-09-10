import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFormProps } from "@/types";
import { toast } from "sonner";

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
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
    <div className="mx-20 my-10 flex gap-10">
      <div className="rounded-full bg-white/5 flex-1">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="请输入关键词..."
          className="h-14 md:text-xl rounded-full px-5 bg-transparent"
        />
      </div>

      <Button className="h-14 rounded-full w-20 text-xl" onClick={handleSubmit}>
        搜索
      </Button>
    </div>
  );
};

export default SearchForm;
