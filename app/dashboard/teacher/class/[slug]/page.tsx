"use client";

import {
  TeacherTaskCard,
  TeacherTaskCardSkeleton,
  TeacherTaskCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { ROUTES } from "@/app/constants/routes";
import { useTeacherClassTasks } from "@/app/hooks/class-tasks/useTeacherClassTasks";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ClassDetailLayout from "@/app/components/pages/Dashboard/Class/Detail/ClassDetailLayout";
import ClassLeaderboardSection from "@/app/components/pages/Dashboard/Class/Detail/ClassLeaderboardSection";
import ClassMemberSection from "@/app/components/pages/Dashboard/Class/Detail/ClassMemberSection";

const TeacherClassDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: classDetailData } = useClassDetail(params.slug, "detail");

  const handleBack = () => {
    router.back();
  };

  const handleNavigateToEditPage = () => {
    router.push(
      `${ROUTES.DASHBOARD.TEACHER.CLASS}/edit/${classDetailData?.slug}`
    );
  };

  const TaskView = () => {
    const { data: classTasks, isLoading } = useTeacherClassTasks(params.slug);

    const handleNavigateToSubmissionPage = (taskSlug: string) => {
      const query = new URLSearchParams({
        class: params.slug,
        task: taskSlug,
      });

      router.push(`${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}?${query}`);
    };

    if (!classTasks) return;

    return (
      <div>
        {/* Task Grid */}
        {isLoading ? (
          <TeacherTaskCardWrapper>
            {Array.from({ length: 4 }).map((_, idx) => (
              <TeacherTaskCardSkeleton key={idx} />
            ))}
          </TeacherTaskCardWrapper>
        ) : classTasks.length > 0 ? (
          <TeacherTaskCardWrapper>
            {classTasks.map((ct) => (
              <TeacherTaskCard
                key={ct.slug}
                task={ct}
                onClick={handleNavigateToSubmissionPage}
              />
            ))}
          </TeacherTaskCardWrapper>
        ) : (
          <NotFound text="Task Not Found" />
        )}
      </div>
    );
  };

  if (!classDetailData) return;

  return (
    <ClassDetailLayout
      mode="teacher"
      classDetail={classDetailData}
      onBack={handleBack}
      onPrimaryAction={handleNavigateToEditPage}
      primaryLabel="Edit"
      primaryVariant="warning"
      tabs={[
        { key: "tasks", label: "Tasks", content: <TaskView /> },
        {
          key: "members",
          label: "Members",
          content: <ClassMemberSection classSlug={params.slug} />,
        },
        {
          key: "leaderboard",
          label: "Leaderboard",
          content: <ClassLeaderboardSection classId={classDetailData.id} />,
        },
      ]}
    />
  );
};

export default TeacherClassDetailPage;
