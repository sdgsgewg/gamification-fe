"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import CreateMaterialForm from "@/app/components/forms/materials/create-material-form";
import { CreateMaterialFormInputs } from "@/app/schemas/materials/createMaterial";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useGrades } from "@/app/hooks/grades/useGrades";

const CreateMaterialPage = () => {
  const router = useRouter();

  const { data: subjectData = [] } = useSubjects();
  const { data: gradeData = [] } = useGrades();

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

  const handleCreateMaterialSuccess = (values: CreateMaterialFormInputs) => {
    console.log("Create material successful with:", values);
    router.push(ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Buat Materi Pelajaran Baru" onBack={handleBack} />
      <CreateMaterialForm
        ref={formRef}
        subjectData={subjectData}
        gradeData={gradeData}
        onFinish={handleCreateMaterialSuccess}
      />

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

export default CreateMaterialPage;
