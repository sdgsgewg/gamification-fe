"use client";

import React, { useRef, useState } from "react";
import EditSubjectForm from "@/app/components/forms/subjects/edit-subject-form";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import { useSubjectDetail } from "@/app/hooks/subjects/useSubjectDetail";

const EditSubjectPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS;

  const { data: subjectData, isLoading } = useSubjectDetail(
    params.slug,
    "edit"
  );
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

  const handleEditSubjectSuccess = () => {
    router.push(`${baseRoute}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Subject" onBack={handleBack} />
      {subjectData && (
        <EditSubjectForm
          ref={formRef}
          subjectData={subjectData}
          onFinish={handleEditSubjectSuccess}
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
