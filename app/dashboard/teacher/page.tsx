"use client";

import React from "react";
import {
  FaBookOpen,
  FaClipboardList,
  FaTrophy,
  FaPlusCircle,
} from "react-icons/fa";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
}

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200"
    style={{
      backgroundColor: "var(--color-card)",
      borderColor: "var(--border-tertiary)",
    }}
  >
    {children}
  </div>
);

const Button: React.FC<{ label: string }> = ({ label }) => (
  <button
    className="w-full py-2 px-4 font-medium rounded-xl transition-all duration-200"
    style={{
      backgroundColor: "var(--color-primary)",
      color: "white",
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
    {label}
  </button>
);

const MainDashboardTeacher: React.FC = () => {
  const dashboardCards: DashboardCardProps[] = [
    {
      title: "Manage Classes",
      description: "View, organize, and edit your teaching classes.",
      icon: <FaBookOpen className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
      buttonLabel: "Go to Classes",
    },
    {
      title: "Review Tasks",
      description: "Check student submissions and provide feedback.",
      icon: (
        <FaClipboardList
          className="w-8 h-8"
          style={{ color: "var(--color-warning)" }}
        />
      ),
      buttonLabel: "Review Now",
    },
    {
      title: "Leaderboard",
      description: "Monitor student performance and rankings.",
      icon: <FaTrophy className="w-8 h-8" style={{ color: "var(--color-success)" }} />,
      buttonLabel: "View Leaderboard",
    },
    {
      title: "Create New Task",
      description: "Add assignments and challenges for your students.",
      icon: (
        <FaPlusCircle
          className="w-8 h-8"
          style={{ color: "var(--color-activity-type)" }}
        />
      ),
      buttonLabel: "Create Task",
    },
  ];

  return (
    <div
      className="flex flex-col w-full min-h-screen p-8 transition-colors duration-300"
      style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome Back, Teacher 👋
        </h1>
        <p className="text-base" style={{ color: "var(--text-tertiary)" }}>
          Manage your classes, track progress, and engage with your students.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <div className="flex flex-col items-center text-center">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  backgroundColor: "var(--color-tertiary)",
                }}
              >
                {card.icon}
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm mt-2 mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {card.description}
              </p>
              <Button label={card.buttonLabel} />
            </div>
          </Card>
        ))}
      </div>

      {/* Optional Section — Recent Submissions */}
      <div className="mt-12">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--text-primary-accent)" }}
        >
          Recent Submissions
        </h2>
        <div
          className="rounded-2xl p-6 border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--border-secondary)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            No recent submissions yet. Once students submit their work, they’ll
            appear here for review.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardTeacher;
