"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import Loading from "@/app/components/shared/Loading";
import NotFound from "@/app/components/shared/not-found/NotFound";
import OverviewTaskList from "@/app/components/pages/Dashboard/Submission/sections/OverviewTaskList";
import TaskDetailAnalyticsView from "@/app/components/pages/Dashboard/Submission/sections/TaskDetailAnalyticsView";
import FilterBar from "@/app/components/shared/FilterBar";
import { SubmissionOverviewScope } from "@/app/types/SubmissionOverviewScope";
import { useTaskAttemptDetailAnalytics } from "@/app/hooks/task-attempts/useTaskAttemptDetailAnalytics";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";
import { TaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/ITaskAttemptAnalyticsResponse";

export interface SubmissionPageConfig {
  scopes: { value: SubmissionOverviewScope; label: string }[];

  overview: Partial<
    Record<
      SubmissionOverviewScope,
      { data: TaskAttemptAnalyticsResponse[]; isLoading: boolean }
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
  config: SubmissionPageConfig;
};

const SubmissionPageContainer: React.FC<Props> = ({ config }) => {
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

  const classDetail = useTaskAttemptDetailAnalytics(taskSlug, classSlug, {
    ...filters,
    scope: TaskAttemptScope.CLASS,
  });
  const activityDetail = useTaskAttemptDetailAnalytics(taskSlug, undefined, {
    ...filters,
    scope: TaskAttemptScope.ACTIVITY,
  });

  const overviewState = config.overview[scope];
  const detailState = scope === "class" ? classDetail : activityDetail;

  return (
    <>
      <DashboardTitle
        title={isDetailView ? "Task Analytics" : "Analytics Overview"}
        showBackButton={isDetailView}
      />

      {isDetailView ? (
        detailState.isLoading ? (
          <Loading />
        ) : !detailState.data ? (
          <NotFound text="Task analytics not found" />
        ) : (
          <TaskDetailAnalyticsView data={detailState.data} />
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
            <NotFound text="No task analytics found" />
          ) : (
            <OverviewTaskList data={overviewState.data} />
          )}
        </>
      )}
    </>
  );
};

export default function SubmissionPage(props: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <SubmissionPageContainer {...props} />
    </Suspense>
  );
}
