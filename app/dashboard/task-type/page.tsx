"use client";

import React, { useEffect, useState } from "react";
import { message, Tag } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const TaskTypePage = () => {
  const { toast } = useToast();
  const [taskTypes, setTaskTypes] = useState<TaskTypeOverviewResponse[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
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

  const fetchTaskTypes = async (searchText?: string) => {
    setIsLoading(true);
    const res = await taskTypeProvider.getTaskTypes({ searchText });

    if (res.isSuccess && res.data) {
      setTaskTypes(
        res.data.map((tt: TaskTypeOverviewResponse, idx: number) => ({
          key: tt.taskTypeId ?? idx,
          ...tt,
        }))
      );
    } else {
      message.error("Gagal memuat tipe tugas");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  const handleNavigateToCreateTaskTypePage = () => {
    router.push("/dashboard/task-type/create");
  };

  const handleView = (slug: string) => {
    router.push(`/dashboard/task-type/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/task-type/edit/${slug}`);
  };

  const showDeleteModal = (materialId: string, name: string) => {
    setDeleteTaskTypeId(materialId);
    setDeleteTaskTypeName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteMaterial = () => {
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
    try {
      const res = await taskTypeProvider.deleteTaskType(id);
      if (res.isSuccess) {
        toast.success("Tipe Tugas berhasil dihapus");
        fetchTaskTypes();
      } else {
        toast.error(res.message ?? "Gagal menghapus tipe tugas");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus");
      }
    }
  };

  // Kolom tabel
  const columns: ColumnType<TaskTypeOverviewResponse>[] = [
    {
      title: "No",
      key: "index",
      width: 50,
      align: "center",
      fixed: "left",
      render: (_: unknown, __: TaskTypeOverviewResponse, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      width: 200,
      onCell: () => ({
        style: { minWidth: 200 },
      }),
    },
    {
      title: "Scope",
      key: "scope",
      width: 150,
      render: (_, record) => record.scope ?? "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Has Deadline",
      key: "hasDeadline",
      width: 150,
      render: (_, record) =>
        record.hasDeadline ? (
          <Tag icon={<CheckOutlined />} color="green">
            Ya
          </Tag>
        ) : (
          <Tag icon={<CloseOutlined />} color="red">
            Tidak
          </Tag>
        ),
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Is Competitive",
      key: "isCompetitive",
      width: 150,
      render: (_, record) =>
        record.isCompetitive ? (
          <Tag icon={<CheckOutlined />} color="green">
            Ya
          </Tag>
        ) : (
          <Tag icon={<CloseOutlined />} color="red">
            Tidak
          </Tag>
        ),
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Is Repeatable",
      key: "isRepeatable",
      width: 150,
      render: (_, record) =>
        record.isRepeatable ? (
          <Tag icon={<CheckOutlined />} color="green">
            Ya
          </Tag>
        ) : (
          <Tag icon={<CloseOutlined />} color="red">
            Tidak
          </Tag>
        ),
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Point Multiplier",
      key: "pointMultiplier",
      width: 150,
      render: (_, record) => record.pointMultiplier ?? "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <RowActions
          onView={() => handleView(record.slug)}
          onEdit={() => handleEdit(record.slug)}
          onDelete={() => showDeleteModal(record.taskTypeId, record.name)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Daftar Tipe Tugas" showBackButton={false} />

      <Table
        columns={columns}
        data={taskTypes}
        rowKey="key"
        loading={isLoading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onAddButtonClick={handleNavigateToCreateTaskTypePage}
        searchable
        searchPlaceholder="Cari tipe tugas…"
        onSearch={(value) => fetchTaskTypes(value)}
        onRefresh={() => fetchTaskTypes()}
      />

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus tipe tugas dengan nama '${deleteTaskTypeName}'?`}
        onConfirm={confirmDeleteMaterial}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TaskTypePage;
