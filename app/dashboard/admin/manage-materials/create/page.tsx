"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import CreateMaterialForm from "@/app/components/forms/materials/create-material-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useGrades } from "@/app/hooks/grades/useGrades";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const CreateMaterialPage = () => {
  const router = useRouter();

  const { data: subjectData = [] } = useSubjects();
  const { data: gradeData = [] } = useGrades();

  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "",
  });

  const formRef = useRef<FormRef>(null);

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;

    if (!isDirty) {
      router.back();
      return;
    }

    setBackConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleBackConfirmation = () => {
    setBackConfirmationModal((prev) => ({ ...prev, visible: false }));
    router.back();
  };

  const handleCreateMaterialSuccess = () => {
    router.push(ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Create New Material" onBack={handleBack} />
      <CreateMaterialForm
        ref={formRef}
        subjectData={subjectData}
        gradeData={gradeData}
        onFinish={handleCreateMaterialSuccess}
      />

      <ConfirmationModal
        visible={backConfirmationModal.visible}
        type="back"
        onConfirm={handleBackConfirmation}
        onCancel={() =>
          setBackConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />
    </>
  );
};

export default CreateMaterialPage;
