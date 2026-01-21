"use client";

import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import OverviewStudentTaskList from "@/app/components/pages/Dashboard/Submission/sections/OverviewStudentTaskList";
import StudentTaskDetailAnalyticsView from "@/app/components/pages/Dashboard/Submission/sections/StudentTaskDetailAnalyticsView";
import FilterBar, { FilterOption } from "@/app/components/shared/FilterBar";
import Loading from "@/app/components/shared/Loading";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";
import { useStudentTaskAttemptsAnalytics } from "@/app/hooks/task-attempts/useStudentTaskAttemptAnalytics";
import { useStudentTaskAttemptDetailAnalytics } from "@/app/hooks/task-attempts/useStudentTaskAttemptDetailAnalytics";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { SubmissionOverviewScope } from "@/app/types/SubmissionOverviewScope";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SubmissionPage() {
  const searchParams = useSearchParams();

  const scopes: FilterOption<SubmissionOverviewScope>[] = [
    { value: "class", label: "Class Tasks" },
    { value: "activity", label: "Activity Tasks" },
  ];
  const [scope, setScope] = useState<SubmissionOverviewScope>("class");
  const [classSlug, setClassSlug] = useState("");
  const [taskSlug, setTaskSlug] = useState("");

  useEffect(() => {
    setClassSlug(searchParams.get("class") ?? "");
    setTaskSlug(searchParams.get("task") ?? "");
  }, [searchParams]);

  const isDetailView = Boolean(classSlug || taskSlug);

  const [filters, setFilters] = useState<FilterTaskAttemptAnalyticsRequest>({
    searchText: "",
    scope: TaskAttemptScope.CLASS,
  });

  const { data: classOverview = [], isLoading: isClassOverviewLoading } =
    useStudentTaskAttemptsAnalytics({
      ...filters,
      scope: TaskAttemptScope.CLASS,
    });

  const { data: activityOverview = [], isLoading: isActivityOverviewLoading } =
    useStudentTaskAttemptsAnalytics({
      ...filters,
      scope: TaskAttemptScope.ACTIVITY,
    });

  const { data: classDetail, isLoading: isClassDetailLoading } =
    useStudentTaskAttemptDetailAnalytics(taskSlug, classSlug, {
      ...filters,
      scope: TaskAttemptScope.CLASS,
    });
  const { data: activityDetail, isLoading: isActivityDetailLoading } =
    useStudentTaskAttemptDetailAnalytics(taskSlug, undefined, {
      ...filters,
      scope: TaskAttemptScope.ACTIVITY,
    });

  const overviewState = scope === "class" ? classOverview : activityOverview;
  const detailState = scope === "class" ? classDetail : activityDetail;

  const isOverviewLoading =
    scope === "class" ? isClassOverviewLoading : isActivityOverviewLoading;
  const isDetailLoading =
    scope === "class" ? isClassDetailLoading : isActivityDetailLoading;

  return (
    <>
      <DashboardTitle
        title={isDetailView ? "Task Analytics" : "Submission Overview"}
        showBackButton={isDetailView}
      />

      {isDetailView ? (
        isDetailLoading ? (
          <Loading />
        ) : !detailState ? (
          <NotFound text="Task analytics not found" />
        ) : (
          <StudentTaskDetailAnalyticsView data={detailState} />
        )
      ) : (
        <>
          <FilterBar options={scopes} value={scope} onChange={setScope} />

          {!overviewState ? (
            <NotFound text="Overview not available" />
          ) : isOverviewLoading ? (
            <Loading />
          ) : overviewState.length === 0 ? (
            <NotFound text="No task submissions found" />
          ) : (
            <OverviewStudentTaskList data={overviewState} />
          )}
        </>
      )}
    </>
  );
}

export default function StudentSubmissionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SubmissionPage />
    </Suspense>
  );
}
