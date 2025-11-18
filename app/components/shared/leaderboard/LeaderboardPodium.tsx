"use client";

import Banner from "./Banner";
import BannerSkeleton from "./BannerSkeleton";

type LeaderboardRow = {
  id?: string;
  name?: string;
  image?: string;
  point?: number;
};

export default function LeaderboardPodium({
  top3,
  defaultImage,
  isLoading,
}: {
  top3: LeaderboardRow[];
  defaultImage: string;
  isLoading: boolean;
}) {
  const podiumCount = 3;

  return (
    <div className="grid grid-cols-3 gap-4">
      {isLoading
        ? Array.from({ length: podiumCount }).map((_, i) => (
            <BannerSkeleton key={i} />
          ))
        : top3.map((cl, idx) => (
            <Banner
              key={cl.id ?? idx}
              tone={idx === 0 ? "gold" : idx === 1 ? "silver" : "bronze"}
              title1={cl.name?.split(" ")[0] ?? ""}
              title2={cl.name?.split(" ").slice(1).join(" ") ?? ""}
              points={cl.point ?? 0}
              image={cl.image ?? defaultImage}
            />
          ))}
    </div>
  );
}
