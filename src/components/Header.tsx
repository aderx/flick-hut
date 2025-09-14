import { HistoryIcon, StarIcon } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-5 flex items-center justify-between border-b border-white/10 px-10">
      <h1 className="text-4xl font-bold">Flick Hut</h1>

      <div className="flex gap-6">
        <p className="flex gap-1">
          <StarIcon />
          收藏
        </p>

        <p className="flex gap-1">
          <HistoryIcon />
          历史记录
        </p>
      </div>
    </header>
  );
}
