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
import { usePublishTask } from "@/app/hooks/tasks/usePublishTask";
import { ConfirmationModalState } from "@/app/interface/modals/IConfirmationModalState";
import { useUnpublishTask } from "@/app/hooks/tasks/useUnpublishTask";
import { useFinalizeTask } from "@/app/hooks/tasks/useFinalizeTask";
import { TaskStatusLabels } from "@/app/enums/TaskStatus";
import { IMAGES } from "@/app/constants/images";

const TaskDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS;

  const { data: taskData, isLoading: isTaskDataLoading } = useTaskDetail(
    params.slug,
    "detail"
  );
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { mutateAsync: publishTask } = usePublishTask(params.slug);
  const { mutateAsync: unpublishTask } = useUnpublishTask(params.slug);
  const { mutateAsync: finalizeTask } = useFinalizeTask(params.slug);

  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskName, setTaskName] = useState<string | null>(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] =
    useState<ConfirmationModalState>({
      visible: false,
      text: "",
    });
  const [publishConfirmationModal, setPublishConfirmationModal] =
    useState<ConfirmationModalState>({
      visible: false,
      text: "",
    });
  const [unpublishConfirmationModal, setUnpublishConfirmationModal] =
    useState<ConfirmationModalState>({
      visible: false,
      text: "",
    });
  const [finalizeConfirmationModal, setFinalizeConfirmationModal] =
    useState<ConfirmationModalState>({
      visible: false,
      text: "",
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  // ----- DELETE TASK -----
  const showDeleteModal = (taskId: string, name: string) => {
    setTaskId(taskId);
    setTaskName(name);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmDelete = () => {
    if (taskId !== null) {
      handleDelete(taskId);
      setTaskId(null);
      setTaskName(null);
      setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelDelete = () => {
    setTaskId(null);
    setTaskName(null);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const res = await deleteTask(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Task deleted successfully");
      router.push(`${baseRoute}`);
    } else {
      toast.error(message ?? "Failed to delete task");
    }
    setIsLoading(false);
  };

  // ----- PUBLISH TASK -----
  const showPublishModal = (taskId: string, name: string) => {
    setTaskId(taskId);
    setTaskName(name);
    setPublishConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmPublish = () => {
    if (taskId !== null) {
      handlePublish(taskId);
      setTaskId(null);
      setTaskName(null);
      setPublishConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelPublish = () => {
    setTaskId(null);
    setTaskName(null);
    setPublishConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handlePublish = async (id: string) => {
    setIsLoading(true);
    const res = await publishTask(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      setPublishConfirmationModal((prev) => ({ ...prev, visible: false }));
      toast.success(message ?? "Task published successfully");
    } else {
      toast.error(message ?? "Failed to publish task");
    }
    setIsLoading(false);
  };

  // ----- UNPUBLISH TASK -----
  const showUnpublishModal = (taskId: string, name: string) => {
    setTaskId(taskId);
    setTaskName(name);
    setUnpublishConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmUnpublish = () => {
    if (taskId !== null) {
      handleUnpublish(taskId);
      setTaskId(null);
      setTaskName(null);
      setUnpublishConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelUnpublish = () => {
    setTaskId(null);
    setTaskName(null);
    setUnpublishConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handleUnpublish = async (id: string) => {
    setIsLoading(true);
    const res = await unpublishTask(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      setUnpublishConfirmationModal((prev) => ({ ...prev, visible: false }));
      toast.success(message ?? "Task unpublished successfully");
    } else {
      toast.error(message ?? "Failed to unpublish task");
    }
    setIsLoading(false);
  };

  // ----- FINALIZE TASK -----
  const showFinalizeModal = (taskId: string, name: string) => {
    setTaskId(taskId);
    setTaskName(name);
    setFinalizeConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmFinalize = () => {
    if (taskId !== null) {
      handleFinalize(taskId);
      setTaskId(null);
      setTaskName(null);
      setFinalizeConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelFinalize = () => {
    setTaskId(null);
    setTaskName(null);
    setFinalizeConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handleFinalize = async (id: string) => {
    setIsLoading(true);
    const res = await finalizeTask(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      setFinalizeConfirmationModal((prev) => ({ ...prev, visible: false }));
      toast.success(message ?? "Task finalized successfully");
    } else {
      toast.error(message ?? "Failed to finalize task");
    }
    setIsLoading(false);
  };

  if (!taskData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { title, image, description } = taskData.taskDetail;

    return (
      <DetailPageLeftSideContent
        name={title}
        image={image ?? IMAGES.TASK}
        description={description ?? ""}
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
      status,
    } = taskData.taskDetail;

    return (
      <>
        {/* Informasi Detail */}
        <TaskDetailInformationTable
          subject={subject ? subject.name : ""}
          material={material?.name}
          type={type.name}
          questionCount={questionCount}
          difficulty={difficulty}
          grade={grade ? grade : ""}
          status={TaskStatusLabels[status]}
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

      const { createdBy, updatedBy, finalizedAt, publishedAt, archivedAt } =
        history;

      return (
        <HistoryTable
          createdBy={createdBy}
          updatedBy={updatedBy}
          publishedAt={publishedAt}
          finalizedAt={finalizedAt}
          archivedAt={archivedAt}
        />
      );
    };

    const QuestionView = () => {
      if (!questions) return;

      return (
        <>
          <h2 className="text-dark font-semibold text-2xl mb-4">
            Question List
          </h2>

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

  const { title, slug } = taskData.taskDetail;

  return (
    <>
      {(isTaskDataLoading || isLoading) && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle
        showBackButton={true}
        task={taskData}
        onEdit={() => {
          if (taskData) handleEdit(slug);
        }}
        onDelete={() => {
          if (taskData) showDeleteModal(taskData.id, title);
        }}
        onPublish={() => {
          if (taskData) showPublishModal(taskData.id, title);
        }}
        onUnpublish={() => {
          if (taskData) showUnpublishModal(taskData.id, title);
        }}
        onFinalize={() => {
          if (taskData) showFinalizeModal(taskData.id, title);
        }}
      />
      {taskData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
        />
      )}

      <ConfirmationModal
        visible={deleteConfirmationModal.visible}
        text={`Are you sure you want to delete task with title '${taskName}'?`}
        type="delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ConfirmationModal
        visible={publishConfirmationModal.visible}
        text={`Are you sure you want to publish task with title '${taskName}'? After publishing, it will become visible to users.`}
        type="publish"
        onConfirm={confirmPublish}
        onCancel={cancelPublish}
      />

      <ConfirmationModal
        visible={unpublishConfirmationModal.visible}
        text={`Are you sure you want to unpublish task with title '${taskName}'? Users will no longer be able to access it until published again.`}
        type="unpublish"
        onConfirm={confirmUnpublish}
        onCancel={cancelUnpublish}
      />

      <ConfirmationModal
        visible={finalizeConfirmationModal.visible}
        text={`Are you sure you want to finalize task with title '${taskName}'? Once finalized, it can no longer be edited.`}
        type="finalize"
        onConfirm={confirmFinalize}
        onCancel={cancelFinalize}
      />
    </>
  );
};

export default TaskDetailPage;
