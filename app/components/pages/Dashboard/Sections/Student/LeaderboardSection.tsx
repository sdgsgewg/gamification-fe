import { LeaderboardResponse } from "@/app/interface/leaderboards/responses/ILeaderboardResponse";
import React from "react";
import {
  LeaderboardCard,
  LeaderboardCardSkeleton,
  LeaderboardCardWrapper,
} from "../../Cards";
import EmptyText from "@/app/components/shared/not-found/EmptyText";

interface LeaderboardSectionProps {
  data: LeaderboardResponse[];
  isLoading: boolean;
}

const LeaderboardSection = ({ data, isLoading }: LeaderboardSectionProps) => {
  return (
    <div className="w-full bg-card p-5 rounded-2xl shadow-md border border-outline">
      <h2 className="text-lg font-semibold text-primary mb-2">Top Students</h2>
      <p className="text-sm text-tx-tertiary leading-relaxed mb-4">
        This leaderboard shows the accumulated points from students’ activities
        across classes.
      </p>

      {isLoading ? (
        <LeaderboardCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <LeaderboardCardSkeleton key={idx} />
          ))}
        </LeaderboardCardWrapper>
      ) : data && data.length > 0 ? (
        <LeaderboardCardWrapper>
          {data.map((user, index) => (
            <LeaderboardCard key={index} index={index} user={user} />
          ))}
        </LeaderboardCardWrapper>
      ) : (
        <EmptyText text={`No leaderboard yet`} />
      )}
    </div>
  );
};

export default LeaderboardSection;
