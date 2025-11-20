"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import ClassLayout from "@/app/components/pages/Dashboard/Class/Layout/ClassLayout";
import { useClassListPage } from "@/app/hooks/classes/useClassListPage";

const TeacherClassPage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.CLASS;

  // ===== ACTIONS =====
  const handleNavigateToClassDetailPage = (slug: string) =>
    router.push(`${baseRoute}/${slug}`);

  const handleCreateClass = () => router.push(`${baseRoute}/create`);

  const {
    classes,
    paginatedClasses,
    isClassLoading,
    gradeData,

    searchControl,
    searchFormId,

    filterFormRef,
    isFilterModalVisible,
    openFilterModal,
    closeFilterModal,
    applyFilter,

    pagination,
    setPagination,
  } = useClassListPage();

  return (
    <ClassLayout
      title="My Class"
      classes={classes}
      paginatedClasses={paginatedClasses}
      isClassLoading={isClassLoading}
      gradeData={gradeData}
      // search
      searchControl={searchControl}
      searchFormId={searchFormId}
      // filter
      filterFormRef={filterFormRef}
      isFilterModalVisible={isFilterModalVisible}
      onOpenFilter={openFilterModal}
      onCloseFilter={closeFilterModal}
      onApplyFilter={applyFilter}
      // pagination
      pagination={pagination}
      onPaginationChange={(page, pageSize) =>
        setPagination({ current: page, pageSize })
      }
      // actions
      onCardClick={handleNavigateToClassDetailPage}
      floatingButtonTitle="Create New Class"
      onFloatingButtonClick={handleCreateClass}
    />
  );
};

export default TeacherClassPage;
