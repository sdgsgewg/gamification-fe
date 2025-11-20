import { LeaderboardResponse } from "@/app/interface/leaderboards/responses/ILeaderboardResponse";
import React from "react";

interface LeaderboardCardProps {
  index: number;
  user: LeaderboardResponse;
}

const LeaderboardCard = ({ index, user }: LeaderboardCardProps) => {
  return (
    <div
      key={user.id}
      className="flex justify-between items-center bg-tertiary p-3 rounded-xl border border-br-tertiary"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-primary">#{index + 1}</span>
        <span className="font-medium text-tx-primary">{user.name}</span>
      </div>
      <span className="text-sm text-tx-tertiary">{user.point} Points</span>
    </div>
  );
};

export default LeaderboardCard;
