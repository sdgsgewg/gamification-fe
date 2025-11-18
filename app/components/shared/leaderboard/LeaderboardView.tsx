"use client";

import LeaderboardPodium from "@/app/components/shared/leaderboard/LeaderboardPodium";
import LeaderboardTable from "@/app/components/shared/leaderboard/LeaderboardTable";

export type LeaderboardRow = {
  id?: string;
  name?: string;
  image?: string;
  point?: number;
};

export default function LeaderboardView({
  leaderboardData,
  isLoading,
  defaultImage,
}: {
  leaderboardData: LeaderboardRow[];
  isLoading: boolean;
  defaultImage: string;
}) {
  if (!leaderboardData || leaderboardData.length === 0) {
    return <p className="text-center py-10">No leaderboard data found</p>;
  }

  const top3 = leaderboardData.slice(0, 3);
  const tableRows = leaderboardData.slice(3);

  return (
    <div className="grid gap-6 lg:grid-cols-[30rem_1fr]">
      {/* Podium */}
      <LeaderboardPodium
        top3={top3}
        defaultImage={defaultImage}
        isLoading={isLoading}
      />

      {/* Table */}
      {tableRows.length > 0 && (
        <LeaderboardTable
          rows={tableRows}
          isLoading={isLoading}
          defaultImage={defaultImage}
        />
      )}
    </div>
  );
}
