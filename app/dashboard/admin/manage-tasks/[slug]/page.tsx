"use client";

import React, { useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  GradeRow,
  MaterialRow,
  NumberRow,
  SubjectRow,
  TaskTypeRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  DurationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { getDateTime } from "@/app/utils/date";
import QuestionCard from "@/app/components/pages/Dashboard/Task/QuestionCard";
import DetailPageLeftSideContent from "@/app/components/pages/Dashboard/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { useDeleteTask } from "@/app/hooks/tasks/useDeleteTask";
import { useTaskDetail } from "@/app/hooks/tasks/useTaskDetail";

const TaskDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS;

  const { data: taskData, isLoading } = useTaskDetail(params.slug, "detail");
  const { mutateAsync: deleteTask } = useDeleteTask();

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteTaskName, setDeleteTaskName] = useState<string | null>(null);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (materialId: string, name: string) => {
    setDeleteTaskId(materialId);
    setDeleteTaskName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteTaskId !== null) {
      handleDelete(deleteTaskId);
      setDeleteTaskId(null);
      setDeleteTaskName(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteTaskId(null);
    setDeleteTaskName(null);
    setIsDeleteConfirmationModalVisible(false);
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
    return (
      <>
        {/* Informasi Detail */}
        <DetailInformationTable>
          <SubjectRow value={taskData.subject.name} />
          <MaterialRow value={taskData.material?.name ?? ""} />
          <TaskTypeRow value={taskData.taskType.name} />
          <NumberRow label="Jumlah Soal" value={taskData.questionCount} />
          <GradeRow value={taskData.taskGrade} />
        </DetailInformationTable>

        {/* Waktu Pengerjaan */}
        <DurationTable
          startTime={getDateTime(taskData.startTime ?? null)}
          endTime={getDateTime(taskData.endTime ?? null)}
          duration={taskData.duration}
        />

        {/* Riwayat */}
        <HistoryTable
          createdBy={taskData.createdBy}
          updatedBy={taskData.updatedBy}
        />
      </>
    );
  };

  const BottomContent = () => {
    return (
      <>
        <h2 className="text-black font-semibold text-2xl mb-4">Daftar Soal</h2>

        <div className="flex flex-col gap-8">
          {taskData.questions.map((q, idx) => (
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
        />
      )}

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus tugas dengan nama '${deleteTaskName}'?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TaskDetailPage;
