"use client";

import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { LeaderboardSection } from "@/app/components/pages/Dashboard/Sections/LeaderboardSection";
import RecentActivitiesSection from "@/app/components/pages/Dashboard/Sections/RecentActivitiesSection";
import PendingTaskSection from "@/app/components/pages/Dashboard/Sections/Student/PendingTaskSection";
import { LeaderboardScopeEnum } from "@/app/enums/LeaderboardSopeEnum";
import { LeaderboardScope } from "@/app/types/LeaderboardScope";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { useUserActivityLogs } from "@/app/hooks/activity-logs/useUserActivityLogs";
import { useTasksFromAllClassesList } from "@/app/hooks/class-tasks/useTasksFromAllClassesList";
import { useStudentLeaderboard } from "@/app/hooks/leaderboards/useStudentLeaderboard";
import { scopeDescription } from "@/app/utils/leaderboard/scopeDescription";
import React from "react";

export default function DashboardPage() {
  const { data: pendingTasks = [], isLoading: isPendingTasksLoading } =
    useTasksFromAllClassesList({
      status: TaskAttemptStatus.NOT_STARTED,
      isClassTask: true,
    });

  // Leaderboard
  const {
    data: studentLeaderboard = [],
    isLoading: isStudentLeaderboardLoading,
  } = useStudentLeaderboard({
    scope: LeaderboardScopeEnum.CLASS,
  });
  const modifiedLeaderboardData = studentLeaderboard.map((student) => ({
    label: student.name,
    value: student.point,
  }));

  const { data: activityLogData = [], isLoading: isActivityLogLoading } =
    useUserActivityLogs();

  const isLoading =
    isPendingTasksLoading ||
    isStudentLeaderboardLoading ||
    isActivityLogLoading;

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* === Main Grid === */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        {/* === Pending Tasks === */}
        <PendingTaskSection
          data={pendingTasks}
          isLoading={isPendingTasksLoading}
        />

        {/* === Leaderboard === */}
        <LeaderboardSection
          title="Leaderboard"
          subtitle={
            scopeDescription[
              LeaderboardScopeEnum.CLASS.toLowerCase() as LeaderboardScope
            ]
          }
          data={modifiedLeaderboardData}
          valueType="points"
          isLoading={isLoading}
        />
      </div>

      <RecentActivitiesSection
        data={activityLogData}
        isLoading={isActivityLogLoading}
      />
    </>
  );
}
