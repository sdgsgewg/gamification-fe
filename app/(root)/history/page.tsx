"use client";

import React, { useState } from "react";
import PageLayout from "../page-layout";
import { useTaskAttemptsByUser } from "@/app/hooks/task-attempts/useTaskAttemptsByUser";
import HistoryCard from "@/app/components/pages/History/HistoryCard";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import Button from "@/app/components/shared/Button";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";

const HistoryPage = () => {
  const [filters, setFilters] = useState<FilterTaskAttemptRequest>({
    searchText: "",
    status: null,
    dateFrom: undefined,
    dateTo: undefined,
  });
  const { data: groupedAttempts = [] } = useTaskAttemptsByUser(filters);

  const tabs: { key: TaskAttemptStatus | null; label: string }[] = [
    {
      key: null,
      label: "All",
    },
    {
      key: TaskAttemptStatus.ON_PROGRESS,
      label: TaskAttemptStatusLabels["on_progress"],
    },
    {
      key: TaskAttemptStatus.COMPLETED,
      label: TaskAttemptStatusLabels["completed"],
    },
  ];

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

      <div className="flex flex-col gap-8">
        {groupedAttempts.map((groupedAttempt, idx) => {
          const { dateLabel, dayLabel, attempts } = groupedAttempt;

          return (
            <div key={idx} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <p className="text-dark text-lg font-semibold">{dateLabel}</p>
                <p className="text-tx-tertiary text-lg">{dayLabel}</p>
              </div>

              <div className="flex flex-col gap-4">
                {attempts.map((attempt, idx) => (
                  <HistoryCard key={idx} attempt={attempt} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
