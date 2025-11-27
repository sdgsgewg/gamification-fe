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
import { useRecentSubmissions } from "@/app/hooks/activity-logs/useRecentSubmissions";
import { useUserMasterHistories } from "@/app/hooks/master-histories/useUserMasterHistories";
import RecentActivitiesSection from "@/app/components/pages/Dashboard/Sections/RecentActivitiesSection";
import {
  QuickActionCard,
  QuickActionCardWrapper,
} from "@/app/components/pages/Dashboard/Cards";

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
  onClick: () => void;
}

const TeacherDashboard: React.FC = () => {
  const router = useRouter();

  const {
    data: recentSubmissionData = [],
    isLoading: isRecentSubmissionLoading,
  } = useRecentSubmissions();
  const { data: masterHistoryData = [], isLoading: isMasterHistoryLoading } =
    useUserMasterHistories();

  const quickActionCards: DashboardCard[] = [
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
      onClick: () => router.push(ROUTES.DASHBOARD.LEADERBOARD),
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
    <>
      {/* Page Title */}
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* === Main Grid Section === */}
      <QuickActionCardWrapper>
        {quickActionCards.map((card, i) => (
          <QuickActionCard
            key={i}
            title={card.title}
            description={card.description}
            icon={card.icon}
            buttonLabel={card.buttonLabel}
            onClick={card.onClick}
          />
        ))}
      </QuickActionCardWrapper>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Recent Submissions */}
        <RecentActivitiesSection
          title="Recent Submissions"
          subtitle="These are the tasks that have been submitted by students."
          noDataText="No submission yet"
          data={recentSubmissionData}
          isLoading={isRecentSubmissionLoading}
        />

        {/* Recent Activities */}
        <RecentActivitiesSection
          data={masterHistoryData}
          isLoading={isMasterHistoryLoading}
        />
      </div>
    </>
  );
};

export default TeacherDashboard;
