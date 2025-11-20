"use client";

import React, { useRef, useState } from "react";
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
import { usePublishTask } from "@/app/hooks/tasks/usePublishTask";
import { useUnpublishTask } from "@/app/hooks/tasks/useUnpublishTask";
import { useFinalizeTask } from "@/app/hooks/tasks/useFinalizeTask";
import { ConfirmationModalState } from "@/app/interface/modals/IConfirmationModalState";
import { TaskStatusLabels } from "@/app/enums/TaskStatus";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { ShareTaskModal } from "@/app/components/modals/ShareTaskModal";
import ShareTaskForm from "@/app/components/forms/class-tasks/share-task-form";
import { useAvailableClasses } from "@/app/hooks/class-tasks/useAvailableClasses";
import { ShareTaskFormInputs } from "@/app/schemas/class-tasks/shareTask";
import { FormRef } from "@/app/interface/forms/IFormRef";

const TeacherTaskDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.TASKS;

  const {
    data: taskData,
    isLoading: isTaskDataLoading,
    refetch: refetchTaskData,
  } = useTaskDetail(params.slug, "detail");
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { mutateAsync: publishTask } = usePublishTask(params.slug);
  const { mutateAsync: unpublishTask } = useUnpublishTask(params.slug);
  const { mutateAsync: finalizeTask } = useFinalizeTask(params.slug);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formRef = useRef<FormRef>(null);

  const [taskId, setTaskId] = useState<string>("");
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
  const [isShareTaskModalVisible, setIsShareTaskModalVisible] = useState(false);

  const { data: availableClasses = [], refetch: refetchAvailableClasses } =
    useAvailableClasses(taskId);

  const handleOpenShareTaskModal = (taskId: string) => {
    setTaskId(taskId);
    setIsShareTaskModalVisible(true);
    refetchAvailableClasses();
  };
  const handleCloseShareTaskModal = () => setIsShareTaskModalVisible(false);

  const handleShareTaskIntoClasses = (values: ShareTaskFormInputs) => {
    handleCloseShareTaskModal();
    refetchTaskData();
  };

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (taskId: string, name: string) => {
    setTaskId(taskId);
    setTaskName(name);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmDelete = () => {
    if (taskId !== null) {
      handleDelete(taskId);
      setTaskId("");
      setTaskName(null);
      setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelDelete = () => {
    setTaskId("");
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
      setTaskId("");
      setTaskName(null);
      setPublishConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelPublish = () => {
    setTaskId("");
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
      setTaskId("");
      setTaskName(null);
      setUnpublishConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelUnpublish = () => {
    setTaskId("");
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
      setTaskId("");
      setTaskName(null);
      setFinalizeConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelFinalize = () => {
    setTaskId("");
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
      status,
    } = taskData.taskDetail;

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
          status={TaskStatusLabels[status]}
        />
      </>
    );
  };

  const BottomContent = () => {
    const [view, setView] =
      useState<TaskDetailBottomContentView>("submissions");

    const { assignedClasses, duration, history, questions } = taskData;
    const isShared = assignedClasses ?? false;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      ...(isShared
        ? [{ key: "submissions" as const, label: "Submissions" }]
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
        return (
          <div>
            <NotFound text="No submission yet" />
          </div>
        );
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
        {view === "submissions" ? (
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
        onShare={() => {
          if (taskData) handleOpenShareTaskModal(taskData.id);
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

      {/* Share Task Modal */}
      <ShareTaskModal
        visible={isShareTaskModalVisible}
        title="Share Task"
        formId="share-task-form"
        onCancel={handleCloseShareTaskModal}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm();
        }}
      >
        <ShareTaskForm
          ref={formRef}
          taskId={taskId}
          classData={availableClasses}
          onFinish={handleShareTaskIntoClasses}
        />
      </ShareTaskModal>

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

export default TeacherTaskDetailPage;
