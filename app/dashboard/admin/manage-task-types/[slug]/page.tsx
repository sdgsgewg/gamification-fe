"use client";

import React, { useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  IsRepeatableRow,
  ScopeRow,
  TimeRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { useTaskTypeDetail } from "@/app/hooks/task-types/useTaskTypeDetail";
import { useDeleteTaskType } from "@/app/hooks/task-types/useDeleteTaskType";

const TaskTypeDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASK_TYPES;

  const { data: taskTypeData, isLoading } = useTaskTypeDetail(
    params.slug,
    "detail"
  );
  const { mutateAsync: deleteTaskType } = useDeleteTaskType();

  const [deleteTaskTypeId, setDeleteTaskTypeId] = useState<string | null>(null);
  const [deleteTaskTypeName, setDeleteTaskTypeName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (taskTypeId: string, name: string) => {
    setDeleteTaskTypeId(taskTypeId);
    setDeleteTaskTypeName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteTaskType = () => {
    if (deleteTaskTypeId !== null) {
      handleDelete(deleteTaskTypeId);
      setDeleteTaskTypeId(null);
      setDeleteTaskTypeName(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteTaskTypeId(null);
    setDeleteTaskTypeName(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTaskType(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Tipe tugas berhasil dihapus");
      router.push(`${baseRoute}`);
    } else {
      toast.error(message ?? "Gagal menghapus tipe tugas");
    }
  };

  if (!taskTypeData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { name, description } = taskTypeData;

    return (
      <DetailPageLeftSideContent
        name={name}
        hasImage={false}
        description={description}
      />
    );
  };

  const RightSideContent = () => {
    return (
      <>
        {/* Informasi Detail */}
        <DetailInformationTable>
          <ScopeRow value={taskTypeData.scope} />
          <TimeRow label="Has Deadline" value={taskTypeData.hasDeadline} />
          <IsRepeatableRow value={taskTypeData.isRepeatable} />
        </DetailInformationTable>

        {/* Riwayat */}
        <HistoryTable
          createdBy={taskTypeData.createdBy}
          updatedBy={taskTypeData.updatedBy}
        />
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
          if (taskTypeData) handleEdit(taskTypeData.slug);
        }}
        onDelete={() => {
          if (taskTypeData)
            showDeleteModal(taskTypeData.taskTypeId, taskTypeData.name);
        }}
      />
      {taskTypeData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
        />
      )}

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus tipe tugas dengan nama '${deleteTaskTypeName}'?`}
        onConfirm={confirmDeleteTaskType}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TaskTypeDetailPage;
