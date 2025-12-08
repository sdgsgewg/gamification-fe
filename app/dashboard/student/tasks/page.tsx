"use client";

import React, { useState } from "react";
import { useTaskAttemptsByUser } from "@/app/hooks/task-attempts/useTaskAttemptsByUser";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import Button from "@/app/components/shared/Button";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import NotFound from "@/app/components/shared/not-found/NotFound";
import {
  TaskHistoryCard,
  TaskHistoryCardSkeleton,
  TaskHistoryCardWrapper,
} from "@/app/components/pages/Dashboard/Task/Student";

const StudentTaskPage = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterTaskAttemptRequest>({
    searchText: "",
    status: null,
    isClassTask: true,
  });
  const { data: groupedAttempts = [], isLoading } =
    useTaskAttemptsByUser(filters);

  const tabs: { key: TaskAttemptStatus | null; label: string }[] = [
    {
      key: null,
      label: "All",
    },
    {
      key: TaskAttemptStatus.NOT_STARTED,
      label: TaskAttemptStatusLabels[TaskAttemptStatus.NOT_STARTED],
    },
    {
      key: TaskAttemptStatus.ON_PROGRESS,
      label: TaskAttemptStatusLabels[TaskAttemptStatus.ON_PROGRESS],
    },
    {
      key: TaskAttemptStatus.PAST_DUE,
      label: TaskAttemptStatusLabels[TaskAttemptStatus.PAST_DUE],
    },
    {
      key: TaskAttemptStatus.SUBMITTED,
      label: TaskAttemptStatusLabels[TaskAttemptStatus.SUBMITTED],
    },
    {
      key: TaskAttemptStatus.COMPLETED,
      label: "Graded",
    },
  ];

  const handleNavigateToTaskDetailPage = (
    classSlug: string,
    taskSlug: string
  ) => {
    const query = new URLSearchParams({
      class: classSlug,
      task: taskSlug,
    });

    router.push(`${ROUTES.DASHBOARD.STUDENT.TASKS_VIEW}?${query.toString()}`);
  };

  return (
    <>
      <DashboardTitle title="Task List" showBackButton={false} />

      {/* Status Tab Filter */}
      <div className="w-full flex items-center border-b border-b-primary">
        <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="middle"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: tab.key,
                }))
              }
              className={`relative flex items-center gap-2 !px-10 !py-1 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150
                ${
                  filters.status === tab.key
                    ? "!bg-primary !text-white"
                    : "!bg-background hover:!bg-background-hover !text-dark"
                }`}
            >
              <span>{tab.label}</span>
              {filters.status === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-br-primary rounded-t-sm" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Task Cards Grouped By Date */}
      {isLoading ? (
        <TaskHistoryCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <TaskHistoryCardSkeleton key={idx} />
          ))}
        </TaskHistoryCardWrapper>
      ) : groupedAttempts && groupedAttempts.length > 0 ? (
        groupedAttempts.map((groupedAttempt, idx) => {
          const { dateLabel, dayLabel, attempts } = groupedAttempt;

          return (
            <div key={idx} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <p className="text-dark text-lg font-semibold">{dateLabel}</p>
                <p className="text-tx-tertiary text-lg">{dayLabel}</p>
              </div>

              <TaskHistoryCardWrapper>
                {attempts.map((attempt, idx) => (
                  <TaskHistoryCard
                    key={idx}
                    attempt={attempt}
                    onClick={() =>
                      handleNavigateToTaskDetailPage(
                        attempt.class.slug,
                        attempt.taskSlug
                      )
                    }
                  />
                ))}
              </TaskHistoryCardWrapper>
            </div>
          );
        })
      ) : (
        <NotFound text="Task Not Found" />
      )}
    </>
  );
};

export default StudentTaskPage;
