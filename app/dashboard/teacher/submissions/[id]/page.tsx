"use client";

import React, { useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import {
  DurationTable,
  HistoryTable,
  TaskDetailInformationTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { getDateTime } from "@/app/utils/date";
import QuestionCard from "@/app/components/pages/Dashboard/Task/QuestionCard";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { useDeleteTask } from "@/app/hooks/tasks/useDeleteTask";
import { useTaskDetail } from "@/app/hooks/tasks/useTaskDetail";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";
import TaskDetailPageBottomContentWrapper from "@/app/components/shared/detail-page/TaskDetailPageBottomContentWrapper";
import SubmissionCard from "@/app/components/pages/Dashboard/Task/Teacher/Cards/SubmissionCard";
import SubmissionCardWrapper from "@/app/components/pages/Dashboard/Task/Teacher/Cards/SubmissionCard/Wrapper";
import { useTaskSubmissionDetail } from "@/app/hooks/task-submissions/useTaskSubmissionDetail";

const SubmissionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.SUBMISSIONS;

  const { data: submissionDetail, isLoading } = useTaskSubmissionDetail(params.id);

  if (!submissionDetail) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { title, image, description } = submissionDetail.taskDetail;

    return (
      <DetailPageLeftSideContent
        name={title}
        image={image}
        description={description}
      />
    );
  };

  const RightSideContent = () => {
    const {
      subject,
      material,
      type,
      questionCount,
      difficulty,
      grade,
    } = submissionDetail.taskDetail;

    return (
      <>
        {/* Informasi Detail */}
        <TaskDetailInformationTable
          subject={subject}
          material={material}
          type={type}
          questionCount={questionCount}
          difficulty={difficulty}
          grade={grade}
        />
      </>
    );
  };

  const BottomContent = () => {
    const [view, setView] = useState<TaskDetailBottomContentView>("");

    const { assignedClasses, duration, history, questions } = submissionDetail;
    const isShared = assignedClasses ?? false;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      ...(isShared
        ? [{ key: "submission" as const, label: "Submission" }]
        : []),
      { key: "duration" as const, label: "Duration" },
      { key: "history" as const, label: "History" },
      { key: "questions" as const, label: "Questions" },
    ];

    const handleChangeTab = (key: TaskDetailBottomContentView) => {
      setView(key);
    };

    const SubmissionView = () => {
      if (!assignedClasses || assignedClasses.length === 0) {
        return <p className="text-dark">No submission yet</p>;
      }

      return (
        <SubmissionCardWrapper>
          {assignedClasses.map((cls) => (
            <SubmissionCard key={cls.id} cls={cls} />
          ))}
        </SubmissionCardWrapper>
      );
    };

    const DurationView = () => {
      if (!duration) return;

      const { startTime, endTime, duration: taskDuration } = duration;

      return (
        <DurationTable
          startTime={getDateTime(startTime ?? null)}
          endTime={getDateTime(endTime ?? null)}
          duration={taskDuration}
        />
      );
    };

    const HistoryView = () => {
      if (!history) return;

      const { createdBy, updatedBy } = history;

      return <HistoryTable createdBy={createdBy} updatedBy={updatedBy} />;
    };

    const QuestionView = () => {
      if (!questions) return;

      return (
        <>
          <h2 className="text-dark font-semibold text-2xl mb-4">Daftar Soal</h2>

          <div className="flex flex-col gap-8">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.questionId}
                index={idx}
                question={q}
                fromPage="detail"
              />
            ))}
          </div>
        </>
      );
    };

    return (
      <TaskDetailPageBottomContentWrapper
        tabs={tabs}
        view={view}
        onChangeTab={handleChangeTab}
      >
        {view === "submission" ? (
          <SubmissionView />
        ) : view === "duration" ? (
          <DurationView />
        ) : view === "history" ? (
          <HistoryView />
        ) : (
          <QuestionView />
        )}
      </TaskDetailPageBottomContentWrapper>
    );
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle
        showBackButton={true}
        onEdit={() => {
          if (submissionDetail) handleEdit(submissionDetail.slug);
        }}
        onDelete={() => {
          if (submissionDetail) showDeleteModal(submissionDetail.taskId, submissionDetail.title);
        }}
        onShare={() => {
          if (submissionDetail) handleShare(submissionDetail.taskId);
        }}
      />

      {submissionDetail && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
          //   hasBottomDivider
        />
      )}

      <ConfirmationModal
        visible={deleteConfirmationModal.visible}
        text={`Are you sure you want to delete task '${deleteTaskName}'?`}
        type="delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default SubmissionDetailPage;
