"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  IsCompetitiveRow,
  IsRepeatableRow,
  NumberRow,
  ScopeRow,
  TimeRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { TaskTypeDetailResponse } from "@/app/interface/task-types/responses/ITaskTypeDetailResponse";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import DetailPageLeftSideContent from "@/app/components/pages/Dashboard/DetailPageLeftSideContent";

const TaskTypeDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [taskTypeData, setTaskTypeData] =
    useState<TaskTypeDetailResponse | null>(null);
  const [deleteTaskTypeId, setDeleteTaskTypeId] = useState<string | null>(null);
  const [deleteTaskTypeName, setDeleteTaskTypeName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!params.slug) return;

    const fetchTaskTypeDetail = async () => {
      setIsLoading(true);

      const res = await taskTypeProvider.getTaskType(params.slug);

      const { isSuccess, message, data } = res;

      if (isSuccess && data) {
        const tt = data;
        setTaskTypeData({
          taskTypeId: tt.taskTypeId,
          name: tt.name,
          slug: tt.slug,
          description: tt.description ?? "",
          scope: tt.scope,
          hasDeadline: tt.hasDeadline,
          isCompetitive: tt.isCompetitive,
          isRepeatable: tt.isRepeatable,
          pointMultiplier: tt.pointMultiplier,
          createdBy: tt.createdBy,
          updatedBy: tt.updatedBy ?? "-",
        });
      } else {
        console.error(message ?? "Gagal memuat detail tipe tugas");
        router.push("/dashboard/task-type");
      }

      setIsLoading(false);
    };

    fetchTaskTypeDetail();
  }, [params.slug]);

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/task-type/edit/${slug}`);
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
    setIsLoading(true);

    const res = await taskTypeProvider.deleteTaskType(id);

    const { isSuccess, message } = res;

    if (isSuccess) {
      toast.success(message ?? "Tipe tugas berhasil dihapus");
      router.push("/dashboard/task-type");
    } else {
      toast.error(message ?? "Gagal menghapus tipe tugas");
    }

    setIsLoading(false);
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
          <IsCompetitiveRow value={taskTypeData.isCompetitive} />
          <IsRepeatableRow value={taskTypeData.isRepeatable} />
          <NumberRow
            label="Point Multiplier"
            value={taskTypeData.pointMultiplier}
          />
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
