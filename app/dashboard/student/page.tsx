"use client";

import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import React from "react";

export default function DashboardPage() {
  // Mock Data
  const tasks = [
    { id: 1, title: "Math Quiz 1", status: "Active", deadline: "Nov 10, 2025" },
    {
      id: 2,
      title: "English Quiz 2",
      status: "Past Due",
      deadline: "Nov 1, 2025",
    },
  ];

  const leaderboard = [
    { id: 1, name: "Sarah L.", points: 1200 },
    { id: 2, name: "Rizky A.", points: 1150 },
    { id: 3, name: "Kevin T.", points: 1120 },
  ];

  const activities = [
    {
      id: 1,
      message: "You completed 'English Essay' task",
      date: "Nov 3, 2025",
    },
    {
      id: 2,
      message: "You earned 50 XP from 'Math Quiz 1'",
      date: "Nov 2, 2025",
    },
    { id: 3, message: "Leaderboard updated", date: "Nov 1, 2025" },
  ];

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* === Main Grid === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* === Pending Tasks === */}
        <div className="col-span-2 bg-[var(--color-card)] p-5 rounded-2xl shadow-md border border-[var(--color-outline)]">
          <h2 className="text-lg font-semibold text-[var(--text-secondary)] mb-3">
            Pending Tasks
          </h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] transition p-4 rounded-xl border border-[var(--border-tertiary)]"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {task.title}
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    Deadline: {task.deadline}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "Active"
                      ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                      : "bg-[var(--color-danger)]/20 text-[var(--color-danger)]"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* === Leaderboard === */}
        <div className="bg-[var(--color-card)] p-5 rounded-2xl shadow-md border border-[var(--color-outline)]">
          <h2 className="text-lg font-semibold text-[var(--text-secondary)] mb-3">
            Top Students
          </h2>
          <ul className="space-y-3">
            {leaderboard.map((user, index) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-[var(--color-tertiary)] p-3 rounded-xl border border-[var(--border-tertiary)]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {user.name}
                  </span>
                </div>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {user.points} XP
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === Recent Activity === */}
      <div className="mt-6 bg-[var(--color-card)] p-5 rounded-2xl shadow-md border border-[var(--color-outline)]">
        <h2 className="text-lg font-semibold text-[var(--text-secondary)] mb-3">
          Recent Activity
        </h2>
        <ul className="divide-y divide-[var(--color-light-muted)]">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="py-3 flex justify-between items-center"
            >
              <p className="text-[var(--text-primary)]">{activity.message}</p>
              <span className="text-sm text-[var(--text-tertiary)]">
                {activity.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
