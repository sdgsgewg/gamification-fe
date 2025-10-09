"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { gradeProvider } from "@/app/functions/GradeProvider";
import CreateMaterialForm from "@/app/components/forms/materials/create-material-form";
import { CreateMaterialFormInputs } from "@/app/schemas/materials/createMaterial";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const CreateMaterialPage = () => {
  const router = useRouter();
  const [subjectData, setSubjectData] = useState<SubjectOverviewResponse[]>([]);
  const [gradeData, setGradeData] = useState<GradeOverviewResponse[]>([]);
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<FormRef>(null);

  const fetchSubjects = async () => {
    try {
      const res = await subjectProvider.getSubjects();
      if (res.isSuccess && res.data) setSubjectData(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects: ", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const res = await gradeProvider.getGrades();
      if (res.isSuccess && res.data) setGradeData(res.data);
    } catch (error) {
      console.error("Failed to fetch grades: ", error);
    }
  };

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
    router.push("/dashboard/material");
  };

  useEffect(() => {
    fetchSubjects();
    fetchGrades();
  }, []);

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
