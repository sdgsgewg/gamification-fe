"use client";

import React from "react";
import LeaderboardViewComponent, {
  LeaderboardRow,
} from "@/app/components/shared/leaderboard/LeaderboardView";
import { IMAGES } from "@/app/constants/images";
import { useClassStudentsLeaderboard } from "@/app/hooks/leaderboards/useClassStudentsLeaderboard";

interface ClassLeaderboardSectionProps {
  classId: string;
}

const ClassLeaderboardSection: React.FC<ClassLeaderboardSectionProps> = ({
  classId,
}) => {
  const { data: leaderboardData, isLoading } =
    useClassStudentsLeaderboard(classId);

  const leaderboardRows: LeaderboardRow[] =
    leaderboardData?.map((u) => ({
      id: u.key,
      name: u.name,
      image: u.image,
      point: u.point,
    })) || [];

  return (
    <LeaderboardViewComponent
      leaderboardData={leaderboardRows}
      isLoading={isLoading}
      defaultImage={IMAGES.DEFAULT_PROFILE}
    />
  );
};

export default ClassLeaderboardSection;
