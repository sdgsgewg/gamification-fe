"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateTaskTypeFormInputs } from "@/app/schemas/task-types/createTaskType";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import CreateTaskTypeForm from "@/app/components/forms/task-types/create-task-type-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";

const CreateTaskTypePage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASK_TYPES;
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

  const handleCreateTaskTypeSuccess = (values: CreateTaskTypeFormInputs) => {
    console.log("Create task type successful with:", values);
    router.push(`${baseRoute}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Buat Tipe Tugas Baru" onBack={handleBack} />
      <CreateTaskTypeForm onFinish={handleCreateTaskTypeSuccess} />

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

export default CreateTaskTypePage;
