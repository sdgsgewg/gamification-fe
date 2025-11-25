"use client";

import { useState } from "react";
import { useClassLeaderboard } from "@/app/hooks/leaderboards/useClassLeaderboard";
import { useStudentLeaderboard } from "@/app/hooks/leaderboards/useStudentLeaderboard";
import { IMAGES } from "@/app/constants/images";
import LeaderboardFilters from "@/app/components/shared/leaderboard/LeaderboardFilters";
import LeaderboardViewComponent from "@/app/components/shared/leaderboard/LeaderboardView";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { LeaderboardScope } from "@/app/types/LeaderboardScope";
import { LeaderboardScopeEnum } from "@/app/enums/LeaderboardSopeEnum";

const LeaderboardPage = () => {
  const [filter, setFilter] = useState<LeaderboardScope>(
    LeaderboardScopeEnum.CLASS.toLowerCase() as LeaderboardScope
  );

  const { data: classLeaderboard = [], isLoading: isClassLoading } =
    useClassLeaderboard();

  const { data: studentLeaderboard = [], isLoading: isStudentLoading } =
    useStudentLeaderboard();

  const isLoading = filter === "class" ? isClassLoading : isStudentLoading;
  const leaderboard =
    filter === "class" ? classLeaderboard : studentLeaderboard;

  const defaultImage =
    filter === "class" ? IMAGES.DEFAULT_CLASS : IMAGES.DEFAULT_PROFILE;

  return (
    <>
      <DashboardTitle title="Leaderboard" />

      <LeaderboardFilters module="dashboard" filter={filter} setFilter={setFilter} />

      <LeaderboardViewComponent
        leaderboardData={leaderboard}
        isLoading={isLoading}
        defaultImage={defaultImage}
      />
    </>
  );
};

export default LeaderboardPage;
