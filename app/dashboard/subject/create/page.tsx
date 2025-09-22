"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSubjectDefaultValues,
  CreateSubjectFormInputs,
} from "@/app/schemas/subjects/createSubject";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import CreateSubjectForm, {
  CreateSubjectFormRef,
} from "@/app/components/forms/subjects/create-subject-form";
import { removeItem, setItem } from "@/app/utils/storage";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const CreateSubjectPage = () => {
  const router = useRouter();
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<CreateSubjectFormRef>(null);

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;

    console.log("Is dirty status: ", isDirty);

    if (!isDirty) {
      router.push("/dashboard/subject");
      return;
    }

    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    removeItem("subjectDraft");

    setIsBackConfirmationModalVisible(false);
    router.push("/dashboard/subject");
  };

  const handleCreateSubjectSuccess = (values: CreateSubjectFormInputs) => {
    console.log("Create subject successful with:", values);
    router.push("/dashboard/subject");
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle
        title="Buat Mata Pelajaran Baru"
        onBack={handleBack}
      />
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
