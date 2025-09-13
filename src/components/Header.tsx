import { HistoryIcon } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-5 flex items-center justify-between border-b border-white/10 px-10">
      <h1 className="text-4xl font-bold">Flick Hut</h1>

      <p className="flex gap-2">
        <HistoryIcon />
        历史记录
      </p>
    </header>
  );
}
