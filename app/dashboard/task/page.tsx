"use client";

import React, { useRef, useEffect, useState } from "react";
import { message } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { taskProvider } from "@/app/functions/TaskProvider";
import { TaskOverviewResponse } from "@/app/interface/tasks/responses/ITaskOverviewResponse";
import FilterTaskForm, {
  FilterTaskFormRef,
  FilterTaskInputs,
} from "@/app/components/forms/tasks/filter-task-form";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { FilterModal } from "@/app/components/modals/FilterModal";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { Grade } from "@/app/interface/grades/IGrade";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const TaskPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskOverviewResponse[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectOverviewResponse[]>([]);
  const [taskTypeData, setTaskTypeData] = useState<TaskTypeOverviewResponse[]>(
    []
  );
  const [gradeData, setGradeData] = useState<Grade[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formRef = useRef<FilterTaskFormRef>(null);

  const fetchTasks = async (values?: FilterTaskInputs) => {
    setIsLoading(true);
    const res = await taskProvider.getTasks(values);

    if (res.isSuccess && res.data) {
      setTasks(
        res.data.map((t: TaskOverviewResponse, idx: number) => ({
          key: t.taskId ?? idx,
          ...t,
        }))
      );
    } else {
      message.error("Gagal memuat tugas");
    }
    setIsLoading(false);
  };

  const fetchSubjects = async () => {
    try {
      const res = await subjectProvider.getSubjects();
      if (res.isSuccess && res.data) setSubjectData(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects: ", error);
    }
  };

  const fetchTaskTypes = async () => {
    try {
      const res = await taskTypeProvider.getTaskTypes();
      if (res.isSuccess && res.data) setTaskTypeData(res.data);
    } catch (error) {
      console.error("Failed to fetch task types: ", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const res = await gradeProvider.getGrades();
      if (res.isSuccess && res.data) setGradeData(res.data);
    } catch (error) {
      console.error("Failed to fetch grades: ", error);
    }
  };

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterTaskInputs) => {
    fetchTasks(values);
    setIsFilterModalVisible(false);
  };

  const handleNavigateToCreateTaskPage = () => {
    router.push("/dashboard/task/create");
  };

  const handleView = (slug: string) => {
    router.push(`/dashboard/task/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/task/edit/${slug}`);
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
    try {
      const res = await taskProvider.deleteTask(id);
      if (res.isSuccess) {
        toast.success("Tugas berhasil dihapus");
        fetchTasks();
      } else {
        toast.error(res.message || "Gagal menghapus tugas");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus tugas");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchSubjects();
    fetchTaskTypes();
    fetchGrades();
  }, []);

  // Kolom tabel
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
      title: "Judul",
      dataIndex: "title",
      key: "title",
      width: 300,
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Tipe",
      key: "taskType",
      width: 250,
      render: (_, record) => record.taskType || "-",
      onCell: () => ({
        style: { minWidth: 250 },
      }),
    },
    {
      title: "Mata Pelajaran",
      key: "subject",
      width: 250,
      render: (_, record) => record.subject || "-",
      onCell: () => ({
        style: { minWidth: 250 },
      }),
    },
    {
      title: "Materi Pelajaran",
      key: "material",
      width: 250,
      render: (_, record) => record.material || "-",
      onCell: () => ({
        style: { minWidth: 250 },
      }),
    },
    {
      title: "Kelas",
      key: "taskGrade",
      width: 150,
      render: (_, record) => record.taskGrade || "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Jumlah Soal",
      key: "questionCount",
      width: 150,
      render: (_, record) => record.questionCount || "-",
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
          onDelete={() => showDeleteModal(record.taskId, record.title)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Daftar Tugas" showBackButton={false} />

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
        searchPlaceholder="Cari tugas…"
        onSearch={(value) => fetchTasks({ searchText: value })}
        onOpenFilter={handleOpenFilter}
        onRefresh={() => fetchTasks()}
      />

      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Tugas"
        formId="filter-task-form"
        onCancel={handleCloseFilter}
        onResetFilters={() => {
          formRef.current?.resetForm(); // reset form pakai ref
        }}
      >
        <FilterTaskForm
          ref={formRef}
          subjectData={subjectData}
          taskTypeData={taskTypeData}
          gradeData={gradeData}
          onFinish={handleApplyFilter}
        />
      </FilterModal>

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus tugas dengan judul '${deleteTaskTitle}'?`}
        onConfirm={confirmDeleteTask}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TaskPage;
