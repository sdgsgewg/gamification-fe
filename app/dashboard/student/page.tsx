"use client";

import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import {
  UserActivityCard,
  UserActivityCardWrapper,
} from "@/app/components/shared/cards";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { useUserActivityLogs } from "@/app/hooks/activity-logs/useUserActivityLogs";
import { useTasksFromAllClasses } from "@/app/hooks/class-tasks/useTasksFromAllClasses";

import React from "react";

export default function DashboardPage() {
  const {
    data: groupedAttempts = [],
    isLoading: isTasksFromAllClassesLoading,
  } = useTasksFromAllClasses({
    status: TaskAttemptStatus.NOT_STARTED,
    isClassTask: true,
  });
  const { data: activityLogData, isLoading: isActivityLogLoading } =
    useUserActivityLogs();

  const leaderboard = [
    { id: 1, name: "Sarah L.", points: 1200 },
    { id: 2, name: "Rizky A.", points: 1150 },
    { id: 3, name: "Kevin T.", points: 1120 },
  ];

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* === Main Grid === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* === Pending Tasks === */}
        <div className="col-span-2 bg-card p-5 rounded-2xl shadow-md border border-outline">
          <h2 className="text-lg font-semibold text-primary mb-3">
            Pending Tasks
          </h2>
          <div className="space-y-3">
            {groupedAttempts.map((groupedAttempt, idx) => {
              const { dateLabel, dayLabel, attempts } = groupedAttempt;

              return (
                <div key={idx}>
                  {attempts.map((attempt, idx) => (
                    <div
                      key={attempt.id}
                      className="flex justify-between items-center bg-tertiary hover:bg-[var(--color-tertiary-hover)] transition p-4 rounded-xl border border-br-tertiary"
                    >
                      <div>
                        <p className="font-medium text-tx-primary">
                          {attempt.title}
                        </p>
                        <p className="text-sm text-tx-tertiary">
                          Deadline: {attempt.deadline}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          attempt.status === TaskAttemptStatus.NOT_STARTED
                            ? "bg-danger/20 text-danger"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {
                          TaskAttemptStatusLabels[
                            attempt.status as TaskAttemptStatus
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* === Leaderboard === */}
        <div className="bg-card p-5 rounded-2xl shadow-md border border-outline">
          <h2 className="text-lg font-semibold text-primary mb-3">
            Top Students
          </h2>
          <ul className="space-y-3">
            {leaderboard.map((user, index) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-tertiary p-3 rounded-xl border border-br-tertiary"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-tx-primary">
                    {user.name}
                  </span>
                </div>
                <span className="text-sm text-tx-tertiary">
                  {user.points} XP
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === Recent Activity === */}
      <UserActivityCardWrapper title="Recent Activities">
        {activityLogData && activityLogData.length > 0 ? (
          activityLogData.map((data) => (
            <UserActivityCard
              key={data.id}
              description={data.description}
              createdAt={data.createdAt}
            />
          ))
        ) : (
          <p className="text-tx-tertiary text-sm">No activities yet.</p>
        )}
      </UserActivityCardWrapper>
    </>
  );
}
