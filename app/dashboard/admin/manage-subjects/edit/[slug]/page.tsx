"use client";

import React, { useRef, useState } from "react";
import EditSubjectForm from "@/app/components/forms/subjects/edit-subject-form";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { EditSubjectFormInputs } from "@/app/schemas/subjects/editSubject";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import { useSubjectDetail } from "@/app/hooks/subjects/useSubjectDetail";

const EditSubjectPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS;

  const { data: subjectData, isLoading } = useSubjectDetail(params.slug, "edit");
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

  const handleEditSubjectSuccess = (values: EditSubjectFormInputs) => {
    console.log("Edit subject successful with:", values);
    router.push(`${baseRoute}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Mata Pelajaran" onBack={handleBack} />
      {subjectData && (
        <EditSubjectForm
          ref={formRef}
          subjectData={subjectData}
          onFinish={handleEditSubjectSuccess}
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

export default EditSubjectPage;
