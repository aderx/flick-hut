import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResultCardProps } from "@/types";

const ResultCard: React.FC<ResultCardProps> = ({ item, onClick }) => {
  const episode = item.videos ? item.videos.length : 0;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  };

  if (episode <= 0) {
    return null;
  }

  return (
    <Card className="cursor-pointer p-0 group" onClick={() => onClick(item)}>
      <CardContent className="p-0 relative overflow-hidden rounded-t-lg">
        <img
          src={item.vod_pic}
          alt={item.name}
          onError={handleImageError}
          className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-500"
        />

        <div className="episode-count absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          共 {episode} 集
        </div>
      </CardContent>

      <CardHeader className="px-4 pb-4">
        <CardTitle className="truncate" title={item.name}>
          {item.name}
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>{item.source_name}</span>
          <span>{item.resolution || "未知清晰度"}</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ResultCard;
