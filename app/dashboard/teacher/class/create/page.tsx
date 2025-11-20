"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import CreateClassForm from "@/app/components/forms/classes/create-class-form";
import { useGrades } from "@/app/hooks/grades/useGrades";
import { CreateClassFormInputs } from "@/app/schemas/classes/createClass";

const CreateClassPage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.CLASS;

  const { data: gradeData = [] } = useGrades();

  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "",
  });

  const formRef = useRef<FormRef<CreateClassFormInputs>>(null);

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

  const handleCreateClassSuccess = () => {
    router.push(`${baseRoute}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Create New Class" onBack={handleBack} />
      <CreateClassForm
        ref={formRef}
        gradeData={gradeData}
        onFinish={handleCreateClassSuccess}
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

export default CreateClassPage;
