"use client";

import React from "react";
import {
  FaBookOpen,
  FaClipboardList,
  FaTrophy,
  FaPlusCircle,
} from "react-icons/fa";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle"; // adjust import path if different

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
}

const TeacherDashboard: React.FC = () => {
  const cards: DashboardCard[] = [
    {
      title: "Manage Classes",
      description: "View, organize, and edit your teaching classes.",
      icon: <FaBookOpen className="w-8 h-8 text-[var(--color-primary)]" />,
      buttonLabel: "Go to Classes",
    },
    {
      title: "Review Tasks",
      description: "Check student submissions and provide feedback.",
      icon: <FaClipboardList className="w-8 h-8 text-[var(--color-warning)]" />,
      buttonLabel: "Review Now",
    },
    {
      title: "Leaderboard",
      description: "Monitor student performance and rankings.",
      icon: <FaTrophy className="w-8 h-8 text-[var(--color-success)]" />,
      buttonLabel: "View Leaderboard",
    },
    {
      title: "Create New Task",
      description: "Add assignments and challenges for your students.",
      icon: <FaPlusCircle className="w-8 h-8 text-[var(--color-activity-type)]" />,
      buttonLabel: "Create Task",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <DashboardTitle title="Teacher Dashboard" showBackButton={false} />

      {/* === Main Grid Section === */}
      <section>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--text-primary-accent)" }}
        >
          Main
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 bg-[var(--color-card)] border-[var(--border-tertiary)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-tertiary)] mb-4">
                  {card.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {card.description}
                </p>
                <button
                  className="px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "var(--color-primary-hover)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "var(--color-primary)")
                  }
                >
                  {card.buttonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Recent Activity Section === */}
      <section className="mt-8">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--text-primary-accent)" }}
        >
          Recent Activity
        </h2>

        <div className="bg-[var(--color-card)] border border-[var(--color-outline)] rounded-2xl p-5 shadow-sm">
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            No recent submissions yet. Once students submit their work, their
            activity will appear here.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
