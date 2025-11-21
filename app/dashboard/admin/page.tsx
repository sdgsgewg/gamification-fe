"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useClasses } from "@/app/hooks/classes/useClasses";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import RecentActivitiesSection from "@/app/components/pages/Dashboard/Sections/RecentActivitiesSection";
import { useUserMasterHistories } from "@/app/hooks/master-histories/useUserMasterHistories";
import { useUserRoleCounts } from "@/app/hooks/users/useUserRoleCounts";
import {
  EssentialStatsCard,
  EssentialStatsCardSkeleton,
  UserStatsCard,
  UserStatsCardSkeleton,
} from "@/app/components/pages/Dashboard/Cards";
import { Book, ClipboardList, Layers, Shapes } from "lucide-react";
import { useTasks } from "@/app/hooks/tasks/useTasks";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useMostPopularTask } from "@/app/hooks/task-attempts/useMostPopularTask";
import { LeaderboardSection } from "@/app/components/pages/Dashboard/Sections/LeaderboardSection";
import BarChartSection from "@/app/components/pages/Dashboard/Sections/BarChartSection";
import { DashboardData } from "@/app/interface/DashboardData";

const essentialIconMap: Record<string, any> = {
  Subjects: Book,
  Materials: Layers,
  Tasks: ClipboardList,
  "Task Types": Shapes,
};

const AdminDashboardPage = () => {
  // User Data
  const { data: userRoleCountData, isLoading: isUserRoleCountLoading } =
    useUserRoleCounts();

  // Essential Data
  const { data: subjectData, isLoading: isSubjectLoading } = useSubjects();
  const { data: materialData, isLoading: isMaterialLoading } = useMaterials();
  const { data: taskData, isLoading: isTaskLoading } = useTasks();
  const { data: taskTypeData, isLoading: isTaskTypeLoading } = useTaskTypes();

  // Most Popular Task Data
  const {
    data: mostPopularTaskData = [],
    isLoading: isMostPopularTaskLoading,
  } = useMostPopularTask();
  const modifiedMostPopularTaskData = mostPopularTaskData.map((task) => ({
    label: task.title,
    value: task.attemptCount,
  }));

  // Class Data
  const { data: classData, isLoading: isClassLoading } = useClasses();

  // Master History Data
  const { data: masterHistoryData = [], isLoading: isMasterHistoryLoading } =
    useUserMasterHistories();

  // State
  const [userStats, setUserStats] = useState<DashboardData[]>([]);
  const [essentialDataStats, setEssentialDataStats] = useState<DashboardData[]>(
    []
  );
  const [classes, setClasses] = useState<DashboardData[]>([]);

  // Set stats saat data berubah
  useEffect(() => {
    if (
      userRoleCountData === undefined ||
      subjectData === undefined ||
      materialData === undefined
    )
      return;

    const userStats: DashboardData[] = [
      { label: "All Users", value: userRoleCountData?.totalUsers ?? 0 },
      { label: "Admins", value: userRoleCountData?.totalAdmins ?? 0 },
      { label: "Teachers", value: userRoleCountData?.totalTeachers ?? 0 },
      { label: "Students", value: userRoleCountData?.totalStudents ?? 0 },
    ];

    const essentialDataStats: DashboardData[] = [
      { label: "Subjects", value: subjectData?.length ?? 0 },
      { label: "Materials", value: materialData?.length ?? 0 },
      { label: "Tasks", value: taskData?.length ?? 0 },
      { label: "Task Types", value: taskTypeData?.length ?? 0 },
    ];

    setUserStats(userStats);
    setEssentialDataStats(essentialDataStats);
  }, [userRoleCountData, subjectData, materialData, taskData, taskTypeData]);

  // Set chart data
  useEffect(() => {
    if (!classData) return;

    const mappedClasses = classData.map((cls: ClassOverviewResponse) => ({
      label: cls.name,
      value: cls.studentCount ?? 0,
    }));

    setClasses(mappedClasses);
  }, [classData]);

  const isLoading =
    isUserRoleCountLoading ||
    isSubjectLoading ||
    isMaterialLoading ||
    isTaskLoading ||
    isTaskTypeLoading ||
    isMostPopularTaskLoading ||
    isClassLoading ||
    isMasterHistoryLoading;

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* User Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <UserStatsCardSkeleton key={i} />
          ))
        ) : userStats.length === 0 || userStats.every((s) => s.value === 0) ? (
          <div className="col-span-full text-center text-muted-foreground py-6">
            No data available yet.
          </div>
        ) : (
          userStats.map((s, idx) => (
            <UserStatsCard key={idx} label={s.label} value={s.value} />
          ))
        )}
      </div>

      {/* Essential Data Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <EssentialStatsCardSkeleton key={i} />
          ))
        ) : essentialDataStats.length === 0 ||
          essentialDataStats.every((s) => s.value === 0) ? (
          <div className="col-span-full text-center text-muted-foreground py-6">
            No data available yet.
          </div>
        ) : (
          essentialDataStats.map((s, idx) => {
            const Icon = essentialIconMap[s.label] ?? Book; // fallback
            return (
              <EssentialStatsCard
                key={idx}
                label={s.label}
                value={s.value}
                icon={Icon}
              />
            );
          })
        )}
      </div>

      {/* Most Popular Task Leaderboard */}
      <LeaderboardSection
        title="Most Popular Tasks"
        data={modifiedMostPopularTaskData}
        valueType="attempts"
        isLoading={isLoading}
      />

      {/* Class Chart */}
      <BarChartSection
        title="Number of Students per Class"
        data={classes}
        isLoading={isLoading}
      />

      <RecentActivitiesSection data={masterHistoryData} isLoading={isLoading} />
    </>
  );
};

export default AdminDashboardPage;
