"use client";

import React, { useRef, useState } from "react";
import { useToast } from "@/app/hooks/use-toast";
import { useNotJoinedClasses } from "@/app/hooks/classes/useNotJoinedClasses";
import { JoinClassModal } from "@/app/components/modals/JoinClassModal";
import JoinClassForm from "@/app/components/forms/classes/join-class-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { JoinClassFormInputs } from "@/app/schemas/classes/joinClass";
import { classStudentProvider } from "@/app/functions/ClassStudentProvider";
import ClassLayout from "@/app/components/pages/Dashboard/Class/Layout/ClassLayout";
import { useClassListPage } from "@/app/hooks/classes/useClassListPage";

const StudentClassPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.STUDENT.CLASS;

  const {
    classes,
    refetchClasses,
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

  const { data: notJoinedClasses = [], isLoading: isNotJoinedClassesLoading } =
    useNotJoinedClasses();

  // ===== ACTIONS =====
  // Navigation handlers
  const handleNavigateToClassDetailPage = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  // Join Class
  const formRef = useRef<FormRef>(null);
  const [isJoinClassModalVisible, setIsJoinClassModalVisible] = useState(false);

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <ClassLayout
      title="My Class"
      classes={classes}
      paginatedClasses={paginatedClasses}
      isLoading={isLoading}
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
      floatingButtonTitle="Join Class"
      floatingButtonIcon={<FontAwesomeIcon icon={faRightToBracket} />}
      onFloatingButtonClick={handleOpenJoinClassModal}
      joinClassModal={
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
      }
    />
  );
};

export default StudentClassPage;
