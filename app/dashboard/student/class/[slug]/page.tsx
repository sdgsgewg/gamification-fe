"use client";

import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  StudentTaskCard,
  StudentTaskCardSkeleton,
  StudentTaskCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";
import ClassDetailLayout from "@/app/components/pages/Dashboard/Class/Detail/ClassDetailLayout";
import ClassLeaderboardSection from "@/app/components/pages/Dashboard/Class/Detail/ClassLeaderboardSection";
import Loading from "@/app/components/shared/Loading";
import { ROUTES } from "@/app/constants/routes";
import { classStudentProvider } from "@/app/functions/ClassStudentProvider";
import { useStudentClassTasks } from "@/app/hooks/class-tasks/useStudentClassTasks";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import { useToast } from "@/app/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import ClassMemberSection from "@/app/components/pages/Dashboard/Class/Detail/ClassMemberSection";

const StudentClassDetailPage = () => {
  const { toast } = useToast();
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.STUDENT.CLASS;

  const { data: classDetailData } = useClassDetail(params.slug, "detail");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [leaveConfirmationModal, setLeaveConfirmationModal] = useState({
    visible: false,
    text: "",
  });

  const handleBack = () => {
    router.back();
  };

  const showLeaveModal = () => {
    setLeaveConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmLeaveClass = () => {
    handleLeaveClass();
    setLeaveConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const cancelLeave = () => {
    setLeaveConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handleLeaveClass = async () => {
    if (!classDetailData) return;

    setIsLoading(true);

    const { id } = classDetailData;

    const res = await classStudentProvider.leaveClass(id);

    const { isSuccess, message } = res;

    if (isSuccess) {
      toast.success(message ?? "You have left class");
      router.push(`${baseRoute}`);
    } else {
      toast.error(message ?? "Failed left class");
    }

    setIsLoading(false);
  };

  const TaskView = () => {
    const { data: classTasks, isLoading } = useStudentClassTasks(params.slug);

    const handleNavigateToTaskDetailPage = (taskSlug: string) => {
      const query = new URLSearchParams({
        class: params.slug,
        task: taskSlug,
      });

      router.push(`${ROUTES.DASHBOARD.STUDENT.TASKS_VIEW}?${query.toString()}`);
    };

    if (!classTasks) return;

    return (
      <div>
        {/* Task Grid */}
        {isLoading ? (
          <StudentTaskCardWrapper>
            {Array.from({ length: 4 }).map((_, idx) => (
              <StudentTaskCardSkeleton key={idx} />
            ))}
          </StudentTaskCardWrapper>
        ) : classTasks.length > 0 ? (
          <StudentTaskCardWrapper>
            {classTasks.map((ct) => (
              <StudentTaskCard
                key={ct.slug}
                task={ct}
                onClick={handleNavigateToTaskDetailPage}
              />
            ))}
          </StudentTaskCardWrapper>
        ) : (
          <p className="text-center">Task not found.</p>
        )}
      </div>
    );
  };

  if (!classDetailData) return;

  return (
    <>
      {isLoading && <Loading />}

      <ClassDetailLayout
        mode="student"
        classDetail={classDetailData}
        onBack={handleBack}
        onPrimaryAction={showLeaveModal}
        primaryLabel="Leave"
        primaryVariant="danger"
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

      <ConfirmationModal
        visible={leaveConfirmationModal.visible}
        text={`Are you sure you want to leave class '${classDetailData.name}'?`}
        type="leave"
        onConfirm={confirmLeaveClass}
        onCancel={cancelLeave}
      />
    </>
  );
};

export default StudentClassDetailPage;
