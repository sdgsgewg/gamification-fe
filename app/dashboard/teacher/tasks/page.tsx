"use client";

import React, { useState } from "react";

const TeacherTaskPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed">("active");

  const tasks = {
    active: [
      {
        title: "Math Quiz - Algebra Basics",
        className: "Kelas 12 IPA 1",
        dueDate: "Nov 10, 2025",
      },
      {
        title: "Essay: The French Revolution",
        className: "Kelas 12 IPS 2",
        dueDate: "Nov 12, 2025",
      },
    ],
    upcoming: [
      {
        title: "Science Project: Human Body System",
        className: "Kelas 12 IPA 2",
        dueDate: "Nov 20, 2025",
      },
    ],
    completed: [
      {
        title: "Midterm Coding Challenge",
        className: "Kelas 12 RPL 1",
        dueDate: "Oct 15, 2025",
      },
      {
        title: "Reading Reflection - Hamlet",
        className: "Kelas 12 Bahasa",
        dueDate: "Oct 10, 2025",
      },
    ],
  };

  const renderTasks = (taskList: any[]) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {taskList.map((task, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border-secondary)] bg-[var(--color-card)] shadow-sm hover:shadow-md transition-all"
        >
          <div className="p-4 border-b border-[var(--border-tertiary)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{task.title}</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-[var(--text-tertiary)] mb-2">{task.className}</p>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
              <span className="w-4 h-4 inline-block">📅</span>
              {task.dueDate}
            </div>
            {activeTab === "completed" ? (
              <button className="w-full border border-[var(--border-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--color-light-emphasis)] text-sm font-medium py-2 rounded-lg transition">
                👁 View Details
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium py-2 rounded-lg transition">
                  ✏️ Edit
                </button>
                <button className="flex-1 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-tertiary-hover)] text-sm font-medium py-2 rounded-lg transition">
                  📄 Submissions
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--background)] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Task Management</h1>
        <p className="text-[var(--text-tertiary)] mt-2">
          Create, review, and manage all your class assignments.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-surface)] border border-[var(--border-secondary)] rounded-xl p-1 shadow-sm w-fit mb-6 flex gap-2">
        {["active", "upcoming", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--color-tertiary-hover)]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "active" && renderTasks(tasks.active)}
        {activeTab === "upcoming" && renderTasks(tasks.upcoming)}
        {activeTab === "completed" && renderTasks(tasks.completed)}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl"
        title="Create New Task"
      >
        +
      </button>
    </div>
  );
};

export default TeacherTaskPage;