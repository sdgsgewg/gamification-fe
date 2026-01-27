"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/components/shared/Button";
import {
  TaskSubmissionStatus,
  TaskSubmissionStatusLabels,
} from "@/app/enums/TaskSubmissionStatus";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { FilterTaskSubmissionRequest } from "@/app/interface/task-submissions/requests/IFilterTaskSubmissionRequest";
import { TaskSubmissionCard } from "@/app/components/pages/Dashboard/Submission/Cards";
import TaskSubmissionCardSkeleton from "@/app/components/pages/Dashboard/Submission/Cards/TaskSubmissionCard/Skeleton";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { useTaskSubmissions } from "@/app/hooks/task-submissions/useTaskSubmissions";

const SubmissionsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [classSlug, setClassSlug] = useState<string>("");
  const [taskSlug, setTaskSlug] = useState<string>("");

  useEffect(() => {
    if (searchParams) {
      const cSlug = searchParams.get("class") ?? "";
      const tSlug = searchParams.get("task") ?? "";

      setClassSlug(cSlug);
      setTaskSlug(tSlug);
    }
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterTaskSubmissionRequest>({
    searchText: "",
    status: null,
  });

  const { data: groupedAttempts = [], isLoading } = useTaskSubmissions(filters);

  const tabs: { key: TaskSubmissionStatus | null; label: string }[] = [
    {
      key: null,
      label: "All",
    },
    {
      key: TaskSubmissionStatus.NOT_STARTED,
      label: TaskSubmissionStatusLabels[TaskSubmissionStatus.NOT_STARTED],
    },
    {
      key: TaskSubmissionStatus.ON_PROGRESS,
      label: TaskSubmissionStatusLabels[TaskSubmissionStatus.ON_PROGRESS],
    },
    {
      key: TaskSubmissionStatus.COMPLETED,
      label: TaskSubmissionStatusLabels[TaskSubmissionStatus.COMPLETED],
    },
  ];

  const handleNavigateToSubmissionDetailPage = (submissionId: string) => {
    router.push(`${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}/${submissionId}`);
  };

  return (
    <>
      <DashboardTitle title="Submission List" showBackButton={false} />

      {/* Status Tab Filter */}
      <div className="w-full flex items-center mb-6 border-b border-b-primary">
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
              className={`relative flex items-center gap-2 px-10! py-1! border-none! rounded-t-lg! rounded-b-none! text-sm transition-all duration-150
                ${
                  filters.status === tab.key
                    ? "bg-primary! text-white!"
                    : "bg-background! hover:bg-background-hover! text-dark!"
                }`}
            >
              <span>{tab.label}</span>
              {filters.status === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.75 bg-br-primary rounded-t-sm" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Submission Card */}
      <div className="flex flex-col gap-8">
        {groupedAttempts && groupedAttempts.length > 0 ? (
          groupedAttempts.map((groupedAttempt, idx) => {
            const { dateLabel, dayLabel, submissions } = groupedAttempt;

            return (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <p className="text-dark text-lg font-semibold">{dateLabel}</p>
                  <p className="text-tx-tertiary text-lg">{dayLabel}</p>
                </div>

                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    <div>
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <TaskSubmissionCardSkeleton key={idx} />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <h1>Hello</h1>
                      {submissions.map((submission, idx) => (
                        <TaskSubmissionCard
                          key={idx}
                          submission={submission}
                          onClick={handleNavigateToSubmissionDetailPage}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <NotFound text="No Submission Found" />
        )}
      </div>
    </>
  );
};

export default SubmissionsPage;
