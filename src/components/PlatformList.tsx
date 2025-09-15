import { useSearchStore } from "@/store/search";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Check, ChevronsUpDown, Divide } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function PlatformList() {
  const {
    searchPlatformList,
    selectedPlatformMap,
    updateSelectedPlatformMap,
    setSelectedPlatformMap,
  } = useSearchStore();
  const [open, setOpen] = useState(false);

  const SeelctedPlatformList = useMemo(() => {
    return Object.values(selectedPlatformMap).filter(Boolean);
  }, [selectedPlatformMap]);

  if (!searchPlatformList || searchPlatformList.length <= 1) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <p className="absolute right-5 top-0 bottom-0 md:flex gap-2 items-center hidden cursor-pointer">
          {SeelctedPlatformList.length > 0
            ? `筛选${SeelctedPlatformList.length}个资源`
            : "聚合资源"}
          <ChevronsUpDown className="opacity-50" />
        </p>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                setSelectedPlatformMap({});
                setOpen(false);
              }}
            >
              聚合资源
            </CommandItem>
          </CommandGroup>

          <CommandList>
            <CommandGroup heading="可筛选平台">
              {searchPlatformList.map((item) => {
                const { name, code } = item;
                const isSelected = SeelctedPlatformList.some(
                  (item) => code === item?.code
                );

                return (
                  <CommandItem
                    key={code}
                    value={code}
                    onSelect={() => {
                      updateSelectedPlatformMap({
                        [code]: isSelected ? undefined : item,
                      });
                    }}
                  >
                    {name}
                    <Check
                      className={cn(
                        "ml-auto",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
