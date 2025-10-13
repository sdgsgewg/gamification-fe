"use client";

import React, { useRef, useState } from "react";
import { Tag } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FilterModal } from "@/app/components/modals/FilterModal";
import FilterTaskTypeForm from "@/app/components/forms/task-types/filter-task-type-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { FilterTaskTypeFormInputs } from "@/app/schemas/task-types/filterTaskType";
import { ROUTES } from "@/app/constants/routes";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useDeleteTaskType } from "@/app/hooks/task-types/useDeleteTaskType";

const TaskTypePage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASK_TYPES;

  const [filters, setFilters] = useState<FilterTaskTypeFormInputs>({
    searchText: "",
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { data: taskTypes = [], isLoading, refetch } = useTaskTypes(filters);
  const { mutateAsync: deleteTaskType } = useDeleteTaskType();
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

  const formRef = useRef<FormRef>(null);

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterTaskTypeFormInputs) => {
    setFilters((prev) => ({
      ...prev,
      ...values, // gabungkan filter baru dengan search text
    }));
    setIsFilterModalVisible(false);
  };

  const handleNavigateToCreateTaskTypePage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleView = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
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
    const res = await deleteTaskType(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Tipe Tugas berhasil dihapus");
      refetch();
    } else {
      toast.error(message ?? "Gagal menghapus tipe tugas");
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
        onSearch={(value) =>
          setFilters((prev) => ({ ...prev, searchText: value }))
        }
        onOpenFilter={handleOpenFilter}
        onRefresh={() => refetch()}
      />

      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Tipe Tugas"
        formId="filter-task-type-form"
        onCancel={handleCloseFilter}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form pakai ref
        }}
      >
        <FilterTaskTypeForm ref={formRef} onFinish={handleApplyFilter} />
      </FilterModal>

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
