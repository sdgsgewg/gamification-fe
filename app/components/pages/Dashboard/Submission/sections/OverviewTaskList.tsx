"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";

export interface OverviewTaskItem {
  task: {
    title: string;
    slug: string;
    isRepeatable: boolean;
  };

  studentsCompleted: number;
  avgScoreLatestAttempt: number;

  /** Hanya ada di class scope */
  totalStudents?: number;

  class?: {
    name: string;
    slug: string;
  };

  deadline?: string;
}

type Props = {
  data: OverviewTaskItem[];
};

const OverviewTaskList: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((data, idx) => {
        const progress =
          data.totalStudents && data.totalStudents > 0
            ? Math.round((data.studentsCompleted / data.totalStudents) * 100)
            : 0;

        return (
          <div
            key={idx}
            className="cursor-pointer rounded-xl border bg-surface p-4 shadow hover:shadow-md transition"
            onClick={() =>
              router.push(
                data.class
                  ? `${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}?class=${data.class.slug}&task=${data.task.slug}`
                  : `${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}?task=${data.task.slug}`,
              )
            }
          >
            <h3 className="text-lg font-semibold">{data.task.title}</h3>

            {data.class && (
              <p className="text-sm text-tx-secondary">{data.class.name}</p>
            )}

            {data.totalStudents !== undefined && (
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
            )}

            <div className="mt-4 flex justify-between text-sm text-tx-secondary">
              {data.totalStudents !== undefined && (
                <span>
                  {data.studentsCompleted}/{data.totalStudents} completed
                </span>
              )}
              <span>Avg Score: {data.avgScoreLatestAttempt}</span>
            </div>

            {data.deadline && (
              <p className="mt-2 text-xs text-tx-tertiary">
                Deadline: {new Date(data.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OverviewTaskList;
