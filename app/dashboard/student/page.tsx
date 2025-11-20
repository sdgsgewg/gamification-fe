"use client";

import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RecentActivitiesSection from "@/app/components/pages/Dashboard/Sections/RecentActivitiesSection";
import LeaderboardSection from "@/app/components/pages/Dashboard/Sections/Student/LeaderboardSection";
import PendingTaskSection from "@/app/components/pages/Dashboard/Sections/Student/PendingTaskSection";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { useUserActivityLogs } from "@/app/hooks/activity-logs/useUserActivityLogs";
import { useTasksFromAllClassesList } from "@/app/hooks/class-tasks/useTasksFromAllClassesList";
import { useStudentLeaderboard } from "@/app/hooks/leaderboards/useStudentLeaderboard";
import React from "react";

export default function DashboardPage() {
  const { data: pendingTasks = [], isLoading: isPendingTasksLoading } =
    useTasksFromAllClassesList({
      status: TaskAttemptStatus.NOT_STARTED,
      isClassTask: true,
    });
  const {
    data: studentLeaderboard = [],
    isLoading: isStudentLeaderboardLoading,
  } = useStudentLeaderboard();
  const { data: activityLogData = [], isLoading: isActivityLogLoading } =
    useUserActivityLogs();

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* === Main Grid === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* === Pending Tasks === */}
        <PendingTaskSection
          data={pendingTasks}
          isLoading={isPendingTasksLoading}
        />

        {/* === Leaderboard === */}
        <LeaderboardSection
          data={studentLeaderboard}
          isLoading={isStudentLeaderboardLoading}
        />
      </div>

      <RecentActivitiesSection
        data={activityLogData}
        isLoading={isActivityLogLoading}
      />
    </>
  );
}
