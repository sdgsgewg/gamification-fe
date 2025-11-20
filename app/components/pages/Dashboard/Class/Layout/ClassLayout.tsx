"use client";

import React from "react";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { FilterOutlined } from "@ant-design/icons";
import { Form } from "antd";
import PaginationInfo from "@/app/components/shared/PaginationInfo";
import FloatingButton from "@/app/components/shared/FloatingButton";
import { FilterModal } from "@/app/components/modals/FilterModal";
import SearchField from "@/app/components/fields/SearchField";
import NotFound from "@/app/components/shared/not-found/NotFound";
import ClassCardWrapper from "@/app/components/pages/Dashboard/Class/Cards/ClassCard/Wrapper";
import ClassCard from "@/app/components/pages/Dashboard/Class/Cards/ClassCard";
import ClassCardSkeleton from "@/app/components/pages/Dashboard/Class/Cards/ClassCard/Skeleton";
import { FilterClassFormInputs } from "@/app/schemas/classes/filterClass";
import { FormRef } from "@/app/interface/forms/IFormRef";
import FilterClassForm from "@/app/components/forms/classes/filter-class-form";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { Control } from "react-hook-form";
import Button from "@/app/components/shared/Button";
import Loading from "@/app/components/shared/Loading";

interface ClassLayoutProps {
  title: string;

  // data
  classes: ClassOverviewResponse[];
  paginatedClasses: ClassOverviewResponse[];
  isLoading?: boolean;
  isClassLoading: boolean;
  gradeData: GradeOverviewResponse[];

  // search
  searchControl: Control<any>;
  searchFormId: string;

  // filter
  isFilterModalVisible: boolean;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onApplyFilter: (values: FilterClassFormInputs) => void;
  filterFormRef: React.RefObject<FormRef | null>;

  // pagination
  pagination: {
    current: number;
    pageSize: number;
  };
  onPaginationChange: (page: number, pageSize: number) => void;

  // actions
  onCardClick: (slug: string) => void;

  // floating button
  floatingButtonTitle: string;
  floatingButtonIcon?: React.ReactNode;
  onFloatingButtonClick: () => void;

  joinClassModal?: React.ReactNode;
}

const ClassLayout: React.FC<ClassLayoutProps> = ({
  title,
  classes,
  paginatedClasses,
  isLoading,
  isClassLoading,
  gradeData,

  // search
  searchControl,
  searchFormId,

  // filter
  isFilterModalVisible,
  onOpenFilter,
  onCloseFilter,
  onApplyFilter,
  filterFormRef,

  // pagination
  pagination,
  onPaginationChange,

  // actions
  onCardClick,
  floatingButtonTitle,
  floatingButtonIcon,
  onFloatingButtonClick,

  joinClassModal,
}) => {
  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title={title} showBackButton={false} />

      {/* SEARCH + FILTER */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <Form id={searchFormId}>
            <SearchField
              control={searchControl}
              name="searchText"
              placeholder="Search by name..."
              formId={searchFormId}
              inputClassName="!px-6 !rounded-3xl"
            />
          </Form>
        </div>

        <div>
          {/* <button
            className="border px-4 py-2 rounded-xl bg-surface"
            onClick={onOpenFilter}
          >
            <FilterOutlined />
          </button> */}
          <Button
            icon={<FilterOutlined />}
            size="large"
            className="!bg-surface !text-dark border"
            onClick={onOpenFilter}
          >
            {""}
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      {isClassLoading ? (
        <ClassCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <ClassCardSkeleton key={idx} />
          ))}
        </ClassCardWrapper>
      ) : classes.length > 0 ? (
        <ClassCardWrapper>
          {paginatedClasses.map((c) => (
            <ClassCard key={c.id} data={c} onClick={onCardClick} />
          ))}
        </ClassCardWrapper>
      ) : (
        <NotFound text="Class Not Found" />
      )}

      {/* PAGINATION */}
      {classes.length > 0 && (
        <PaginationInfo
          total={classes.length}
          pagination={pagination}
          label="classes"
          onChange={onPaginationChange}
        />
      )}

      {/* FLOATING BUTTON */}
      <FloatingButton
        title={floatingButtonTitle}
        icon={floatingButtonIcon}
        onClick={onFloatingButtonClick}
      />

      {/* FILTER MODAL */}
      <FilterModal
        visible={isFilterModalVisible}
        formId="filter-class-form"
        title="Filter Class"
        onCancel={onCloseFilter}
        onResetFilters={() => filterFormRef.current?.resetForm?.()}
      >
        <FilterClassForm
          ref={filterFormRef}
          gradeData={gradeData}
          onFinish={onApplyFilter}
        />
      </FilterModal>

      {joinClassModal}
    </>
  );
};

export default ClassLayout;
