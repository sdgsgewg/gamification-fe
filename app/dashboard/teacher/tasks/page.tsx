"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { FilterModal } from "@/app/components/modals/FilterModal";
import FilterTaskForm from "@/app/components/forms/tasks/filter-task-form";
import { Form } from "antd";
import SearchField from "@/app/components/fields/SearchField";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import Button from "@/app/components/shared/Button";
import { FilterOutlined } from "@ant-design/icons";
import {
  TaskCard,
  TaskCardSkeleton,
  TaskCardWrapper,
} from "@/app/components/pages/Dashboard/Task/Teacher/Cards";
import NotFound from "@/app/components/shared/not-found/NotFound";
import PaginationInfo from "@/app/components/shared/PaginationInfo";
import FloatingButton from "@/app/components/shared/FloatingButton";

const TeacherTaskPage = () => {
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
  });
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);

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

  const {
    data: tasks = [],
    isLoading: isTaskLoading,
    refetch: refetchTasks,
  } = useTasks(filters);
  const { data: subjectData = [] } = useSubjects();
  const { data: materialData = [] } = useMaterials();
  const { data: taskTypeData = [] } = useTaskTypes();
  const { data: gradeData = [] } = useGrades();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  // Compute paginated data
  const paginatedTasks = useMemo(() => {
    const startIdx = (pagination.current - 1) * pagination.pageSize;
    const endIdx = pagination.current * pagination.pageSize;
    return tasks.slice(startIdx, endIdx);
  }, [tasks, pagination]);

  // Automatically refetch every time filters updated
  useEffect(() => {
    refetchTasks();
  }, [filters]);

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

  // Navigation handlers
  const handleNavigateToCreateTaskPage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleNavigateToViewTaskPage = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  const handleNavigateToEditTaskPage = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  return (
    <>
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

      {isTaskLoading ? (
        <TaskCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <TaskCardSkeleton key={idx} />
          ))}
        </TaskCardWrapper>
      ) : tasks.length > 0 ? (
        <>
          <TaskCardWrapper>
            {paginatedTasks.map((task, i) => (
              <TaskCard
                key={i}
                task={task}
                onEdit={handleNavigateToEditTaskPage}
                onView={handleNavigateToViewTaskPage}
              />
            ))}
          </TaskCardWrapper>
        </>
      ) : (
        <NotFound text="Task Not Found" />
      )}

      {/* Pagination + Display */}
      {tasks.length > 0 && (
        <PaginationInfo
          total={tasks.length}
          pagination={pagination}
          label="tasks"
          onChange={(page, pageSize) =>
            setPagination({ current: page, pageSize })
          }
        />
      )}

      {/* Floating Add Button */}
      <FloatingButton
        title="Create New Task"
        onClick={handleNavigateToCreateTaskPage}
      />

      {/* Filter Modal */}
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
    </>
  );
};

export default TeacherTaskPage;
