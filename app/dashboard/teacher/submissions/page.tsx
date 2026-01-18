"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import Loading from "@/app/components/shared/Loading";
import NotFound from "@/app/components/shared/not-found/NotFound";
import OverviewTaskList from "@/app/components/pages/Dashboard/Submission/sections/OverviewTaskList";
import ClassTaskAnalyticsView from "@/app/components/pages/Dashboard/Submission/sections/ClassTaskAnalyticsView";
import { useTaskAttemptsFromActivityPage } from "@/app/hooks/task-attempts/useTaskAttemptsFromActivityPage";
import { SubmissionOverviewScope } from "@/app/types/SubmissionOverviewScope";
import { useTaskAttemptsFromClass } from "@/app/hooks/task-attempts/useTaskAttemptsFromClass";
import { useStudentAttemptsFromClassTask } from "@/app/hooks/task-attempts/useStudentAttemptsFromClassTask";
import { useStudentAttemptsFromActivityTask } from "@/app/hooks/task-attempts/useStudentAttemptsFromActivityTask";
import FilterBar from "@/app/components/shared/FilterBar";

export const dynamic = "force-dynamic";

const SubmissionsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [classSlug, setClassSlug] = useState("");
  const [taskSlug, setTaskSlug] = useState("");

  const submissionScopeOptions = [
    { value: "class", label: "Class Tasks" },
    { value: "activity", label: "Activity Tasks" },
  ] satisfies { value: SubmissionOverviewScope; label: string }[];

  const [scope, setScope] = useState<SubmissionOverviewScope>("class");

  useEffect(() => {
    setClassSlug(searchParams.get("class") ?? "");
    setTaskSlug(searchParams.get("task") ?? "");
  }, [searchParams]);

  const isDetailView = Boolean(classSlug || taskSlug);

  const { data: classAttemptsData = [], isLoading: isClassAttemptsLoading } =
    useTaskAttemptsFromClass();

  const {
    data: activityAttemptsData = [],
    isLoading: isActivityAttemptsLoading,
  } = useTaskAttemptsFromActivityPage();

  const overviewData = useMemo(
    () => (scope === "class" ? classAttemptsData : activityAttemptsData),
    [scope, classAttemptsData, activityAttemptsData],
  );

  const isOverviewLoading =
    scope === "class" ? isClassAttemptsLoading : isActivityAttemptsLoading;

  const {
    data: classAttemptDetailData,
    isLoading: isClassAttemptDetailLoading,
  } = useStudentAttemptsFromClassTask(classSlug, taskSlug);

  const {
    data: activityAttemptDetailData,
    isLoading: isActivityAttemptDetailLoading,
  } = useStudentAttemptsFromActivityTask(taskSlug);

  const detailData = useMemo(
    () =>
      scope === "class" ? classAttemptDetailData : activityAttemptDetailData,
    [scope, classAttemptDetailData, activityAttemptDetailData],
  );

  const isDetailLoading =
    scope === "class"
      ? isClassAttemptDetailLoading
      : isActivityAttemptDetailLoading;

  return (
    <>
      <DashboardTitle
        title={isDetailView ? "Task Analytics" : "Submission Overview"}
        showBackButton={isDetailView}
      />

      {isDetailView ? (
        isDetailLoading ? (
          <Loading />
        ) : !detailData ? (
          <NotFound text="Task analytics not found" />
        ) : (
          <ClassTaskAnalyticsView data={detailData} />
        )
      ) : (
        <>
          {/* FILTER BAR */}
          <FilterBar<SubmissionOverviewScope>
            options={submissionScopeOptions}
            value={scope}
            onChange={setScope}
          />

          {/* CONTENT */}
          {isOverviewLoading ? (
            <Loading />
          ) : overviewData.length === 0 ? (
            <NotFound text="No task submissions found" />
          ) : (
            <OverviewTaskList data={overviewData} />
          )}
        </>
      )}
    </>
  );
};

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SubmissionsPageContent />
    </Suspense>
  );
}
