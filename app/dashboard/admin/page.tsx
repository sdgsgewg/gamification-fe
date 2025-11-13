"use client";

import React, { useEffect, useState } from "react";
import {
  StatsCard,
  StatsCardSkeleton,
} from "@/app/components/pages/Dashboard/Cards";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { Role } from "@/app/enums/Role";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useUsers } from "@/app/hooks/users/useUsers";
import { useClasses } from "@/app/hooks/classes/useClasses";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import {
  BarChart,
  BarChartSkeleton,
  BarChartWrapper,
} from "@/app/components/pages/Dashboard/Charts";
import RecentActivitiesSection from "@/app/components/pages/Dashboard/Sections/RecentActivitiesSection";
import { useUserMasterHistories } from "@/app/hooks/master-histories/useUserMasterHistories";

interface DashboardData {
  label: string;
  value: number;
}

const AdminDashboardPage = () => {
  const { data: studentData, isLoading: isStudentLoading } = useUsers({
    role: Role.STUDENT,
  });
  const { data: teacherData, isLoading: isTeacherLoading } = useUsers({
    role: Role.TEACHER,
  });
  const { data: subjectData, isLoading: isSubjectLoading } = useSubjects();
  const { data: materialData, isLoading: isMaterialLoading } = useMaterials();
  const { data: classData, isLoading: isClassLoading } = useClasses();
  const { data: masterHistoryData = [], isLoading: isMasterHistoryLoading } =
    useUserMasterHistories();

  // State
  const [stats, setStats] = useState<DashboardData[]>([]);
  const [classes, setClasses] = useState<DashboardData[]>([]);

  // Global loading state
  const isLoading =
    isStudentLoading ||
    isTeacherLoading ||
    isSubjectLoading ||
    isMaterialLoading;

  // 🔹 Set stats saat data berubah
  useEffect(() => {
    if (
      teacherData === undefined ||
      studentData === undefined ||
      subjectData === undefined ||
      materialData === undefined
    )
      return;

    const updatedStats: DashboardData[] = [
      { label: "Teachers", value: teacherData?.length ?? 0 },
      { label: "Students", value: studentData?.length ?? 0 },
      { label: "Subjects", value: subjectData?.length ?? 0 },
      { label: "Materials", value: materialData?.length ?? 0 },
    ];

    setStats(updatedStats);
  }, [teacherData, studentData, subjectData, materialData]);

  // Set chart data
  useEffect(() => {
    if (!classData) return;

    const mappedClasses = classData.map((cls: ClassOverviewResponse) => ({
      label: cls.name,
      value: cls.studentCount ?? 0,
    }));

    setClasses(mappedClasses);
  }, [classData]);

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : stats.length === 0 || stats.every((s) => s.value === 0) ? (
          <div className="col-span-full text-center text-muted-foreground py-6">
            No data available yet.
          </div>
        ) : (
          stats.map((s, idx) => (
            <StatsCard key={idx} label={s.label} value={s.value} />
          ))
        )}
      </div>

      {/* Chart */}
      <BarChartWrapper title="Number of Students per Class">
        {isClassLoading ? (
          <BarChartSkeleton />
        ) : classes.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            No class data available.
          </div>
        ) : (
          <BarChart data={classes} />
        )}
      </BarChartWrapper>

      <RecentActivitiesSection
        data={masterHistoryData}
        isLoading={isMasterHistoryLoading}
      />
    </>
  );
};

export default AdminDashboardPage;
