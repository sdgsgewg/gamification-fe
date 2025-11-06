"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { EditMaterialFormInputs } from "@/app/schemas/materials/editMaterial";
import EditMaterialForm from "@/app/components/forms/materials/edit-material-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { useMaterialDetail } from "@/app/hooks/materials/useMaterialDetail";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useGrades } from "@/app/hooks/grades/useGrades";

const EditMaterialPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS;

  const { data: materialData, isLoading } = useMaterialDetail(
    params.slug,
    "edit"
  );
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

  const handleEditMaterialSuccess = (values: EditMaterialFormInputs) => {
    console.log("Material edit successful with:", values);
    router.push(`${baseRoute}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Learning Material" onBack={handleBack} />
      {materialData && (
        <EditMaterialForm
          ref={formRef}
          materialData={materialData}
          subjectData={subjectData}
          gradeData={gradeData}
          onFinish={handleEditMaterialSuccess}
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

export default EditMaterialPage;
