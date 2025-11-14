"use client";

import React, { useState } from "react";
import PageLayout from "../page-layout";
import { useTaskAttemptsByUser } from "@/app/hooks/task-attempts/useTaskAttemptsByUser";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import Button from "@/app/components/shared/Button";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import {
  HistoryCard,
  HistoryCardSkeleton,
  HistoryCardWrapper,
} from "@/app/components/pages/History/Cards";
import NotFound from "@/app/components/shared/NotFound";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";

const HistoryPage = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterTaskAttemptRequest>({
    searchText: "",
    status: null,
    dateFrom: undefined,
    dateTo: undefined,
  });
  const { data: groupedAttempts = [], isLoading } =
    useTaskAttemptsByUser(filters);

  const tabs: { key: TaskAttemptStatus | null; label: string }[] = [
    {
      key: null,
      label: "All",
    },
    {
      key: TaskAttemptStatus.ON_PROGRESS,
      label: TaskAttemptStatusLabels[TaskAttemptStatus.ON_PROGRESS],
    },
    {
      key: TaskAttemptStatus.COMPLETED,
      label: TaskAttemptStatusLabels[TaskAttemptStatus.COMPLETED],
    },
  ];

  const handleNavigateToHistoryDetailPage = (id: string) => {
    router.push(`${ROUTES.ROOT.HISTORY}/${id}`);
  };

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold mb-8">Activity History</h1>

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

      {/* History Cards Grouped By Date */}
      {isLoading ? (
        <HistoryCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <HistoryCardSkeleton key={idx} />
          ))}
        </HistoryCardWrapper>
      ) : groupedAttempts && groupedAttempts.length > 0 ? (
        groupedAttempts.map((groupedAttempt, idx) => {
          const { dateLabel, dayLabel, attempts } = groupedAttempt;

          return (
            <div key={idx} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <p className="text-dark text-lg font-semibold">{dateLabel}</p>
                <p className="text-tx-tertiary text-lg">{dayLabel}</p>
              </div>

              <HistoryCardWrapper>
                {attempts.map((attempt, idx) => (
                  <HistoryCard
                    key={idx}
                    attempt={attempt}
                    onClick={() =>
                      handleNavigateToHistoryDetailPage(attempt.id)
                    }
                  />
                ))}
              </HistoryCardWrapper>
            </div>
          );
        })
      ) : (
        <NotFound text="Task Not Found" />
      )}
    </PageLayout>
  );
};

export default HistoryPage;
