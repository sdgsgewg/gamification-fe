"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateSubjectFormInputs } from "@/app/schemas/subjects/createSubject";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import CreateSubjectForm from "@/app/components/forms/subjects/create-subject-form";
import { removeItem } from "@/app/utils/storage";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";

const CreateSubjectPage = () => {
  const router = useRouter();
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
    removeItem("subjectDraft");

    setIsBackConfirmationModalVisible(false);
    router.back();
  };

  const handleCreateSubjectSuccess = (values: CreateSubjectFormInputs) => {
    console.log("Create subject successful with:", values);
    router.push("/dashboard/subject");
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

export default CreateSubjectPage;
