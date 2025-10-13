"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import EditTaskTypeForm from "@/app/components/forms/task-types/edit-task-type-form";
import { EditTaskTypeFormInputs } from "@/app/schemas/task-types/editTaskType";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { useTaskTypeDetail } from "@/app/hooks/task-types/useTaskTypeDetail";

const EditTaskTypePage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASK_TYPES;

  const { data: taskTypeData, isLoading } = useTaskTypeDetail(
    params.slug,
    "edit"
  );

  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<FormRef>(null);

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;

    if (!isDirty) {
      router.back();
      return;
    }

    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    setIsBackConfirmationModalVisible(false);
    router.back();
  };

  const handleEdittaskTypeSuccess = (values: EditTaskTypeFormInputs) => {
    console.log("Edit task type successful with:", values);
    router.push(`${baseRoute}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Tipe Tugas" onBack={handleBack} />
      {taskTypeData && (
        <EditTaskTypeForm
          ref={formRef}
          taskTypeData={taskTypeData}
          onFinish={handleEdittaskTypeSuccess}
        />
      )}

      {isBackConfirmationModalVisible && (
        <BackConfirmationModal
          visible={isBackConfirmationModalVisible}
          onConfirm={handleBackConfirmation}
          onCancel={() => setIsBackConfirmationModalVisible(false)}
        />
      )}
    </>
  );
};

export default EditTaskTypePage;
