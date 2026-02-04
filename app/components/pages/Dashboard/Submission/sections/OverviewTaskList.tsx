"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { TaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/ITaskAttemptAnalyticsResponse";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { Role } from "@/app/enums/Role";

type Props = {
  data: TaskAttemptAnalyticsResponse[];
};

const OverviewTaskList: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  const { user, role } = useGetCachedUser();

  const [userRole, setUserRole] = useState<Role>(Role.STUDENT);
  const [baseRoute, setBaseRoute] = useState<string>("");

  useEffect(() => {
    if (user && role) {
      setUserRole(role);
      switch (role) {
        case Role.ADMIN:
          setBaseRoute(`${ROUTES.DASHBOARD.ADMIN.ANALYTICS}`);
          break;
        case Role.TEACHER:
          setBaseRoute(`${ROUTES.DASHBOARD.TEACHER.ANALYTICS}`);
          break;
        default:
          break;
      }
    }
  }, [user, role]);

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
                  ? `${baseRoute}?class=${data.class.slug}&task=${data.task.slug}`
                  : `${baseRoute}?task=${data.task.slug}`,
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
                  {data.studentsCompleted}/{data.totalStudents} students
                  completed
                </span>
              )}
              {!data.class && <span>Total Attempts: {data.totalAttempts}</span>}
              <span>Avg Score: {data.avgScoreAllAttempts}</span>
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
