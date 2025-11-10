"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import EditClassForm from "@/app/components/forms/classes/edit-class-form";
import { EditClassFormInputs } from "@/app/schemas/classes/editClass";

const EditSubjectPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.CLASS;

  const { data: classData, isLoading } = useClassDetail(params.slug, "edit");
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

  const handleEditClassSuccess = (values: EditClassFormInputs) => {
    console.log("Edit class successful with:", values);
    router.push(`${baseRoute}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Class" onBack={handleBack} />
      {classData && (
        <EditClassForm
          ref={formRef}
          classData={classData}
          onFinish={handleEditClassSuccess}
        />
      )}

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

export default EditSubjectPage;
