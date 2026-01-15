"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { TeacherClassTaskAnalyticsDto } from "@/app/interface/task-submissions/responses/ITeacherClassTaskAnalyticsResponse";

type Props = {
  data: TeacherClassTaskAnalyticsDto[];
};

const OverviewTaskList: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((task, idx) => {
        const progress =
          task.totalStudents === 0
            ? 0
            : Math.round((task.studentsCompleted / task.totalStudents) * 100);

        return (
          <div
            key={idx}
            className="cursor-pointer rounded-xl border bg-surface p-4 shadow hover:shadow-md transition"
            onClick={() =>
              router.push(
                `${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}?class=${task.classSlug}&task=${task.taskSlug}`
              )
            }
          >
            {/* Title */}
            <h3 className="text-lg font-semibold text-dark">
              {task.taskTitle}
            </h3>
            <p className="text-sm text-tx-secondary">{task.className}</p>

            {/* Progress */}
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

            {/* Stats */}
            <div className="mt-4 flex justify-between text-sm text-tx-secondary">
              <span>
                {task.studentsCompleted}/{task.totalStudents} completed
              </span>
              <span>Avg Score: {task.avgScoreLatestAttempt}</span>
            </div>

            {/* Deadline */}
            {task.deadline && (
              <p className="mt-2 text-xs text-tx-tertiary">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OverviewTaskList;
