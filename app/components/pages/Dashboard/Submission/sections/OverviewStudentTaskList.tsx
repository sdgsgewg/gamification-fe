"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { StudentTaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentTaskAttemptAnalyticsResponse";

type Props = {
  data: StudentTaskAttemptAnalyticsResponse[];
};

const OverviewStudentTaskList: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((data, idx) => {
        const {
          task,
          class: classData,
          completedAttemptCount,
          totalAttemptCount,
          deadline,
        } = data;

        const progress = Math.round(
          (completedAttemptCount / totalAttemptCount) * 100,
        );

        return (
          <div
            key={idx}
            className="cursor-pointer rounded-xl border bg-surface p-4 shadow hover:shadow-md transition"
            onClick={() =>
              router.push(
                classData
                  ? `${ROUTES.DASHBOARD.STUDENT.SUBMISSIONS}?class=${classData.slug}&task=${task.slug}`
                  : `${ROUTES.DASHBOARD.STUDENT.SUBMISSIONS}?task=${task.slug}`,
              )
            }
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>

            {classData && (
              <p className="text-sm text-tx-secondary">{classData.name}</p>
            )}

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded bg-light-muted">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm text-tx-secondary">
              <span>
                {completedAttemptCount}/{totalAttemptCount} attempts completed
              </span>
            </div>

            {deadline && (
              <p className="mt-2 text-xs text-tx-tertiary">
                Deadline: {new Date(deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OverviewStudentTaskList;
