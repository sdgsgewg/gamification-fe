"use client";

import React, { useRef, useState } from "react";
import { useToast } from "@/app/hooks/use-toast";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { TaskOverviewResponse } from "@/app/interface/tasks/responses/ITaskOverviewResponse";
import FilterTaskForm from "@/app/components/forms/tasks/filter-task-form";
import { FilterModal } from "@/app/components/modals/FilterModal";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FilterTaskFormInputs } from "@/app/schemas/tasks/filterTask";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import { useTasks } from "@/app/hooks/tasks/useTasks";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useGrades } from "@/app/hooks/grades/useGrades";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useDeleteTask } from "@/app/hooks/tasks/useDeleteTask";

const TaskPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS;

  const [filters, setFilters] = useState<FilterTaskFormInputs>({
    searchText: "",
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { data: tasks = [], isLoading, refetch } = useTasks(filters);
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { data: subjectData = [] } = useSubjects();
  const { data: materialData = [] } = useMaterials();
  const { data: taskTypeData = [] } = useTaskTypes();
  const { data: gradeData = [] } = useGrades();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState<string | null>(null);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);

  const formRef = useRef<FormRef>(null);

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterTaskFormInputs) => {
    setFilters((prev) => ({
      ...prev,
      ...values, // merge new filters with search text
    }));
    setIsFilterModalVisible(false);
  };

  const handleNavigateToCreateTaskPage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleView = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (taskId: string, title: string) => {
    setDeleteTaskId(taskId);
    setDeleteTaskTitle(title);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteTask = () => {
    if (deleteTaskId !== null) {
      handleDelete(deleteTaskId);
      setDeleteTaskId(null);
      setDeleteTaskTitle(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteTaskId(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTask(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Task deleted successfully");
      refetch();
    } else {
      toast.error(message || "Failed to delete task");
    }
  };

  // Table columns
  const columns: ColumnType<TaskOverviewResponse>[] = [
    {
      title: "No",
      key: "index",
      width: 50,
      align: "center",
      fixed: "left",
      render: (_: unknown, __: TaskOverviewResponse, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 300,
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Type",
      key: "taskType",
      width: 250,
      render: (_, record) => record.taskType || "-",
      onCell: () => ({
        style: { minWidth: 250 },
      }),
    },
    {
      title: "Subject",
      key: "subject",
      width: 250,
      render: (_, record) => record.subject || "-",
      onCell: () => ({
        style: { minWidth: 250 },
      }),
    },
    {
      title: "Material",
      key: "material",
      width: 250,
      render: (_, record) => record.material || "-",
      onCell: () => ({
        style: { minWidth: 250 },
      }),
    },
    {
      title: "Class",
      key: "taskGrade",
      width: 150,
      render: (_, record) => record.taskGrade || "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Question Count",
      key: "questionCount",
      width: 150,
      render: (_, record) => record.questionCount || "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Difficulty",
      key: "difficulty",
      width: 150,
      render: (_, record) => record.difficulty || "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <RowActions
          onView={() => handleView(record.slug)}
          onEdit={() => handleEdit(record.slug)}
          onDelete={() => showDeleteModal(record.taskId, record.title)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Task List" showBackButton={false} />

      <Table
        columns={columns}
        data={tasks}
        rowKey="key"
        loading={isLoading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onAddButtonClick={handleNavigateToCreateTaskPage}
        searchable
        searchPlaceholder="Search tasks…"
        onSearch={(value) =>
          setFilters((prev) => ({ ...prev, searchText: value }))
        }
        onOpenFilter={handleOpenFilter}
        onRefresh={() => refetch()}
      />

      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Tasks"
        formId="filter-task-form"
        onCancel={handleCloseFilter}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form using ref
        }}
      >
        <FilterTaskForm
          ref={formRef}
          subjectData={subjectData}
          materialData={materialData}
          taskTypeData={taskTypeData}
          gradeData={gradeData}
          onFinish={handleApplyFilter}
        />
      </FilterModal>

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Are you sure you want to delete the task titled '${deleteTaskTitle}'?`}
        onConfirm={confirmDeleteTask}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TaskPage;
