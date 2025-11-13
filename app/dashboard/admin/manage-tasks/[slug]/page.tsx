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
import Button from "@/app/components/shared/Button";

const TaskDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS;

  const { data: taskData, isLoading } = useTaskDetail(params.slug, "detail");
  const { mutateAsync: deleteTask } = useDeleteTask();

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteTaskName, setDeleteTaskName] = useState<string | null>(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    visible: false,
    text: "",
  });

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (materialId: string, name: string) => {
    setDeleteTaskId(materialId);
    setDeleteTaskName(name);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmDelete = () => {
    if (deleteTaskId !== null) {
      handleDelete(deleteTaskId);
      setDeleteTaskId(null);
      setDeleteTaskName(null);
      setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteTaskId(null);
    setDeleteTaskName(null);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTask(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Tugas berhasil dihapus");
      router.push(`${baseRoute}`);
    } else {
      toast.error(message ?? "Gagal menghapus tugas");
    }
  };

  const handleShare = (id: string) => {
    console.log("Share task with id: ", id);
  };

  if (!taskData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { title, image, description } = taskData;

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
      taskType,
      questionCount,
      difficulty,
      taskGrade,
    } = taskData;

    return (
      <>
        {/* Informasi Detail */}
        <TaskDetailInformationTable
          subject={subject.name}
          material={material?.name}
          type={taskType.name}
          questionCount={questionCount}
          difficulty={difficulty}
          grade={taskGrade}
        />
      </>
    );
  };

  const BottomContent = () => {
    const [view, setView] = useState<TaskDetailBottomContentView>("duration");

    const { duration, history, questions } = taskData;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      { key: "duration" as const, label: "Duration" },
      { key: "history" as const, label: "History" },
      { key: "questions" as const, label: "Questions" },
    ];

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
      <>
        {/* Navigation tab antar view */}
        <div className="w-full flex items-center mb-6 border-b border-b-primary">
          <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                size="middle"
                onClick={() => setView(tab.key)}
                className={`relative flex items-center gap-2 !px-10 !py-1 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150
                ${
                  view === tab.key
                    ? "!bg-primary !text-white"
                    : "!bg-background hover:!bg-background-hover !text-dark"
                }`}
              >
                <span>{tab.label}</span>
                {view === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-br-primary rounded-t-sm" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full mx-0 md:max-w-[70%] lg:max-w-[60%] md:mx-auto">
          {view === "duration" ? (
            <DurationView />
          ) : view === "history" ? (
            <HistoryView />
          ) : (
            <QuestionView />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle
        showBackButton={true}
        onEdit={() => {
          if (taskData) handleEdit(taskData.slug);
        }}
        onDelete={() => {
          if (taskData) showDeleteModal(taskData.taskId, taskData.title);
        }}
        onShare={() => {
          if (taskData) handleShare(taskData.taskId);
        }}
      />
      {taskData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
          hasBottomDivider
        />
      )}

      <ConfirmationModal
        visible={deleteConfirmationModal.visible}
        text={`Apakah kamu yakin ingin menghapus tugas dengan nama '${deleteTaskName}'?`}
        type="delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TaskDetailPage;
