"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useUserClasses } from "@/app/hooks/classes/useUserClasses";
import Button from "@/app/components/shared/Button";
import { FilterOutlined } from "@ant-design/icons";
import SearchField from "@/app/components/fields/SearchField";
import { useForm } from "react-hook-form";
import { Form } from "antd";
import { useNotJoinedClasses } from "@/app/hooks/classes/useNotJoinedClasses";
import { JoinClassModal } from "@/app/components/modals/JoinClassModal";
import JoinClassForm from "@/app/components/forms/classes/join-class-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import {
  ClassCard,
  ClassCardSkeleton,
  ClassCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { FilterClassFormInputs } from "@/app/schemas/classes/filterClass";
import PaginationInfo from "@/app/components/shared/PaginationInfo";
import FloatingButton from "@/app/components/shared/FloatingButton";
import { FilterModal } from "@/app/components/modals/FilterModal";
import FilterClassForm from "@/app/components/forms/classes/filter-class-form";
import { useGrades } from "@/app/hooks/grades/useGrades";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { JoinClassFormInputs } from "@/app/schemas/classes/joinClass";
import { classStudentProvider } from "@/app/functions/ClassStudentProvider";
import Loading from "@/app/components/shared/Loading";

const StudentClassPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.STUDENT.CLASS;

  const [isJoinClassModalVisible, setIsJoinClassModalVisible] = useState(false);

  const { data: notJoinedClasses = [], isLoading: isNotJoinedClassesLoading } =
    useNotJoinedClasses();

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

  const [filters, setFilters] = useState<FilterClassFormInputs>({
    searchText: debouncedSearch,
  });
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);

  // Update filters on every 'debouncedSearch' change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchText: debouncedSearch,
    }));
  }, [debouncedSearch]);

  const {
    data: classes = [],
    isLoading: isClassLoading,
    refetch: refetchClasses,
  } = useUserClasses(filters);
  const { data: gradeData = [] } = useGrades();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Compute paginated data
  const paginatedClasses = useMemo(() => {
    const startIdx = (pagination.current - 1) * pagination.pageSize;
    const endIdx = pagination.current * pagination.pageSize;
    return classes.slice(startIdx, endIdx);
  }, [classes, pagination]);

  // Automatically refetch every time filters updated
  useEffect(() => {
    refetchClasses();
  }, [filters, refetchClasses]);

  const formRef = useRef<FormRef>(null);

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterClassFormInputs) => {
    setFilters((prev) => ({
      ...prev,
      ...values, // merge new filters with search text
    }));
    setIsFilterModalVisible(false);
  };

  // Navigation handlers
  const handleNavigateToClassDetailPage = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  const handleOpenJoinClassModal = () => setIsJoinClassModalVisible(true);
  const handleCloseJoinClassModal = () => setIsJoinClassModalVisible(false);

  const handleJoinClass = async (values: JoinClassFormInputs) => {
    setIsLoading(true);

    const res = await classStudentProvider.joinClass(values);

    const { isSuccess, message } = res;

    if (isSuccess) {
      if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form pakai ref
      handleCloseJoinClassModal();
      refetchClasses();
      toast.success(message ?? "You have successfully join class");
    } else {
      toast.error(message ?? "Failed join class");
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="My Class" showBackButton={false} />

      {/* Search and Filter */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <Form id="search-class-form">
            <SearchField
              control={control}
              name="searchText"
              placeholder="Search by name..."
              formId="search-class-form"
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

      {/* Class Grid */}
      {isClassLoading ? (
        <ClassCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <ClassCardSkeleton key={idx} />
          ))}
        </ClassCardWrapper>
      ) : classes.length > 0 ? (
        <ClassCardWrapper>
          {paginatedClasses.map((c) => (
            <ClassCard
              key={c.id}
              data={c}
              onClick={handleNavigateToClassDetailPage}
            />
          ))}
        </ClassCardWrapper>
      ) : (
        <NotFound text="Class Not Found" />
      )}

      {/* Pagination + Display */}
      {classes.length > 0 && (
        <PaginationInfo
          total={classes.length}
          pagination={pagination}
          label="classes"
          onChange={(page, pageSize) =>
            setPagination({ current: page, pageSize })
          }
        />
      )}

      {/* Floating Join Button */}
      <FloatingButton
        title="Join Class"
        icon={<FontAwesomeIcon icon={faRightToBracket} />}
        onClick={handleOpenJoinClassModal}
      />

      {/* Join Class Modal */}
      <JoinClassModal
        visible={isJoinClassModalVisible}
        title="Join Class"
        formId="join-class-form"
        onCancel={handleCloseJoinClassModal}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form pakai ref
        }}
      >
        <JoinClassForm
          ref={formRef}
          classData={notJoinedClasses}
          isLoading={isNotJoinedClassesLoading}
          onFinish={handleJoinClass}
        />
      </JoinClassModal>

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Class"
        formId="filter-class-form"
        onCancel={handleCloseFilter}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form using ref
        }}
      >
        <FilterClassForm
          ref={formRef}
          gradeData={gradeData}
          onFinish={handleApplyFilter}
        />
      </FilterModal>
    </>
  );
};

export default StudentClassPage;
