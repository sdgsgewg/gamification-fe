"use client";

import React from "react";
import {
  FaBookOpen,
  FaClipboardList,
  FaTrophy,
  FaPlusCircle,
} from "react-icons/fa";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle"; // adjust import path if different
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import Button from "@/app/components/shared/Button";
import { useUserActivityLogs } from "@/app/hooks/activity-logs/useUserActivityLogs";
import { useUserMasterHistories } from "@/app/hooks/master-histories/useUserMasterHistories";
import {
  UserActivityCard,
  UserActivityCardWrapper,
} from "@/app/components/shared/cards";

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
  onClick: () => void;
}

const TeacherDashboard: React.FC = () => {
  const router = useRouter();

  const { data: masterHistoryData, isLoading: isMasterHistoryLoading } =
    useUserMasterHistories();
  const { data: activityLogData, isLoading: isActivityLogLoading } =
    useUserActivityLogs();

  const cards: DashboardCard[] = [
    {
      title: "Manage Classes",
      description: "View, organize, and edit your teaching classes.",
      icon: <FaBookOpen className="w-8 h-8 text-primary" />,
      buttonLabel: "Go to Classes",
      onClick: () => router.push(ROUTES.DASHBOARD.TEACHER.CLASS),
    },
    {
      title: "Review Tasks",
      description: "Check student submissions and provide feedback.",
      icon: <FaClipboardList className="w-8 h-8 text-warning" />,
      buttonLabel: "Review Now",
      onClick: () => router.push(ROUTES.DASHBOARD.TEACHER.SUBMISSIONS),
    },
    {
      title: "Leaderboard",
      description: "Monitor student performance and rankings.",
      icon: <FaTrophy className="w-8 h-8 text-success" />,
      buttonLabel: "View Leaderboard",
      onClick: () => router.push(ROUTES.DASHBOARD.TEACHER.LEADERBOARD),
    },
    {
      title: "Create New Task",
      description: "Add assignments and challenges for your students.",
      icon: <FaPlusCircle className="w-8 h-8 text-activity-type" />,
      buttonLabel: "Create Task",
      onClick: () => router.push(`${ROUTES.DASHBOARD.TEACHER.TASKS}/create`),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <DashboardTitle title="Teacher Dashboard" showBackButton={false} />

      {/* === Main Grid Section === */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 bg-card border-br-tertiary"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-tertiary mb-4">
                  {card.icon}
                </div>
                <h3 className="text-tx-primary text-lg font-semibold mb-2">
                  {card.title}
                </h3>
                <p className="text-tx-secondary text-sm mb-4">
                  {card.description}
                </p>
                <Button
                  variant="primary"
                  size="large"
                  className="!px-5 !rounded-xl"
                >
                  {card.buttonLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <UserActivityCardWrapper title="Recent Submissions" isHalfWidth>
          {activityLogData && activityLogData.length > 0 ? (
            activityLogData.map((data) => (
              <UserActivityCard
                key={data.id}
                description={data.description}
                createdAt={data.createdAt}
              />
            ))
          ) : (
            <p className="text-tx-tertiary text-sm">No submission yet.</p>
          )}
        </UserActivityCardWrapper>

        <UserActivityCardWrapper title="Recent Activities" isHalfWidth>
          {masterHistoryData && masterHistoryData.length > 0 ? (
            masterHistoryData.map((data) => (
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
      </div>
    </div>
  );
};

export default TeacherDashboard;
