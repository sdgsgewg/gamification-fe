"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import Loading from "@/app/components/shared/Loading";
import NotFound from "@/app/components/shared/not-found/NotFound";
import FilterBar from "@/app/components/shared/FilterBar";
import { SubmissionOverviewScope } from "@/app/types/SubmissionOverviewScope";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";
import { useStudentTaskAttemptDetailAnalytics } from "@/app/hooks/task-attempts/useStudentTaskAttemptDetailAnalytics";
import StudentTaskDetailAnalyticsView from "./sections/StudentTaskDetailAnalyticsView";
import OverviewStudentTaskList from "./sections/OverviewStudentTaskList";
import { StudentTaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentTaskAttemptAnalyticsResponse";

export interface StudentSubmissionPageConfig {
  scopes: { value: SubmissionOverviewScope; label: string }[];

  overview: Partial<
    Record<
      SubmissionOverviewScope,
      { data: StudentTaskAttemptAnalyticsResponse[]; isLoading: boolean }
    >
  >;

  // detail: Partial<
  //   Record<SubmissionOverviewScope, { data: any; isLoading: boolean }>
  // >;

  // resolveIsDetailView: (params: {
  //   classSlug: string;
  //   taskSlug: string;
  // }) => boolean;
}

type Props = {
  config: StudentSubmissionPageConfig;
};

const StudentSubmissionPageContainer: React.FC<Props> = ({ config }) => {
  const searchParams = useSearchParams();

  const [scope, setScope] = useState<SubmissionOverviewScope>(
    config.scopes[0].value,
  );
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

  const classDetail = useStudentTaskAttemptDetailAnalytics(
    taskSlug,
    classSlug,
    {
      ...filters,
      scope: TaskAttemptScope.CLASS,
    },
  );
  const activityDetail = useStudentTaskAttemptDetailAnalytics(
    taskSlug,
    undefined,
    {
      ...filters,
      scope: TaskAttemptScope.ACTIVITY,
    },
  );

  const overviewState = config.overview[scope];
  const detailState = scope === "class" ? classDetail : activityDetail;

  return (
    <>
      <DashboardTitle
        title={isDetailView ? "Task Analytics" : "Submission Overview"}
        showBackButton={isDetailView}
      />

      {isDetailView ? (
        detailState.isLoading ? (
          <Loading />
        ) : !detailState.data ? (
          <NotFound text="Task analytics not found" />
        ) : (
          <StudentTaskDetailAnalyticsView data={detailState.data} />
        )
      ) : (
        <>
          <FilterBar
            options={config.scopes}
            value={scope}
            onChange={setScope}
          />

          {!overviewState ? (
            <NotFound text="Overview not available" />
          ) : overviewState.isLoading ? (
            <Loading />
          ) : overviewState.data.length === 0 ? (
            <NotFound text="No task submissions found" />
          ) : (
            <OverviewStudentTaskList data={overviewState.data} />
          )}
        </>
      )}
    </>
  );
};

export default function StudentSubmissionPage(props: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <StudentSubmissionPageContainer {...props} />
    </Suspense>
  );
}
