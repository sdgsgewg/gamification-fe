"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/app/hooks/tasks/useTasks";
import { ROUTES } from "@/app/constants/routes";
import { FilterTaskFormInputs } from "@/app/schemas/tasks/filterTask";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useGrades } from "@/app/hooks/grades/useGrades";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useDeleteTask } from "@/app/hooks/tasks/useDeleteTask";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FilterModal } from "@/app/components/modals/FilterModal";
import FilterTaskForm from "@/app/components/forms/tasks/filter-task-form";
import { Form } from "antd";
import SearchField from "@/app/components/fields/SearchField";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import Button from "@/app/components/shared/Button";
import { FilterOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import {
  TaskCard,
  TaskCardWrapper,
} from "@/app/components/pages/Dashboard/Task/Teacher/Cards";

const TeacherTaskPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.TASKS;

  const { user } = useGetCachedUser();

  const { control, watch } = useForm({
    defaultValues: { searchText: "" },
  });
  const searchValue = watch("searchText");

  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const [filters, setFilters] = useState<FilterTaskFormInputs>({
    searchText: debouncedSearch,
    creatorId: user?.userId,
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Update filters when user is found
  useEffect(() => {
    if (!user) return;
    setFilters((prev) => ({
      ...prev,
      creatorId: user?.userId,
    }));
  }, [user]);

  // Update filters on every 'debouncedSearch' change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchText: debouncedSearch,
    }));
  }, [debouncedSearch]);

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

  // Automatically refetch every time filters updated
  useEffect(() => {
    refetch();
  }, [filters]);

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState<string | null>(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    visible: false,
    text: "",
  });

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

  const handleNavigateToViewTaskPage = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  const handleNavigateToEditTaskPage = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const handleShareTask = () => {};

  const handleOpenDeleteConfirmation = (taskId: string, title: string) => {
    setDeleteTaskId(taskId);
    setDeleteTaskTitle(title);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmDeleteTask = () => {
    if (deleteTaskId !== null) {
      handleDelete(deleteTaskId);
      setDeleteTaskId(null);
      setDeleteTaskTitle(null);
      setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteTaskId(null);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
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

  return (
    <>
      {/* Header */}
      <Toaster position="top-right" />
      <DashboardTitle
        title="Task Management"
        subtitle="Create, review, and manage all your class assignments."
        showBackButton={false}
      />

      {/* Search and Filter */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <Form id="search-task-form">
            <SearchField
              control={control}
              name="searchText"
              placeholder="Search by title..."
              formId="search-task-form"
              inputClassName="!px-6 !rounded-3xl"
            />
          </Form>
        </div>
        <div>
          <Button
            icon={<FilterOutlined />}
            size="large"
            className="!bg-surface !text-dark border"
            onClick={handleOpenFilter}
          >
            {""}
          </Button>
        </div>
      </div>

      {/* Content */}
      <TaskCardWrapper>
        {tasks.map((task, i) => (
          <TaskCard
            key={i}
            task={task}
            onShare={handleShareTask}
            onDelete={handleOpenDeleteConfirmation}
            onEdit={handleNavigateToEditTaskPage}
            onView={handleNavigateToViewTaskPage}
          />
        ))}
      </TaskCardWrapper>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary-hover text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl text-2xl transition duration-300 ease-in-out cursor-pointer"
        title="Create New Task"
        onClick={handleNavigateToCreateTaskPage}
      >
        +
      </button>

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

      <ConfirmationModal
        visible={deleteConfirmationModal.visible}
        text={`Are you sure you want to delete the task titled '${deleteTaskTitle}'?`}
        type="delete"
        onConfirm={confirmDeleteTask}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default TeacherTaskPage;
