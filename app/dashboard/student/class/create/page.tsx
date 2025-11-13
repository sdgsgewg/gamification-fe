"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateSubjectFormInputs } from "@/app/schemas/subjects/createSubject";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import CreateSubjectForm from "@/app/components/forms/subjects/create-subject-form";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";

const CreateClassPage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.STUDENT.CLASS;
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

  const handleCreateSubjectSuccess = (values: CreateSubjectFormInputs) => {
    console.log("Create subject successful with:", values);
    router.push(`${baseRoute}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Buat Mata Pelajaran Baru" onBack={handleBack} />
      <CreateSubjectForm ref={formRef} onFinish={handleCreateSubjectSuccess} />

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

export default CreateClassPage;
