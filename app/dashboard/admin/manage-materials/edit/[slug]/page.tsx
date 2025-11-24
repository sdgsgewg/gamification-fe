"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import EditMaterialForm from "@/app/components/forms/materials/edit-material-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
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

  const handleEditMaterialSuccess = () => {
    router.push(`${baseRoute}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Material" onBack={handleBack} />
      {materialData && (
        <EditMaterialForm
          ref={formRef}
          materialData={materialData}
          subjectData={subjectData}
          gradeData={gradeData}
          onFinish={handleEditMaterialSuccess}
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

export default EditMaterialPage;
