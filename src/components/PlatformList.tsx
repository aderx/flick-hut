import { useSearchStore } from "@/store/search";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function PlatformList() {
  const { searchPlatformList, selectedPlatform, setSelectedPlatform } =
    useSearchStore();

  return (
    <ScrollArea className="mx-10 my-5 pb-2">
      <div className="flex">
        {searchPlatformList.map((tab, index) => (
          <Button
            key={tab.name}
            onClick={() => setSelectedPlatform(tab.code)}
            variant={selectedPlatform === tab.code ? "default" : "outline"}
            className="mr-2 mb-2 whitespace-nowrap"
          >
            {tab.name}
          </Button>
        ))}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
