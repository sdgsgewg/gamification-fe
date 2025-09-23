"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { MaterialDetailResponse } from "@/app/interface/materials/responses/IMaterialDetailResponse";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { message } from "antd";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { EditMaterialFormInputs } from "@/app/schemas/materials/editMaterial";
import EditMaterialForm from "@/app/components/forms/materials/edit-material-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { removeItem } from "@/app/utils/storage";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const EditMaterialPage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [materialData, setMaterialData] =
    useState<EditMaterialFormInputs | null>(null);
  const [subjectData, setSubjectData] = useState<SubjectOverviewResponse[]>([]);
  const [gradeData, setGradeData] = useState<GradeOverviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<FormRef>(null);

  const fetchMaterialDetail = async () => {
    setIsLoading(true);

    const res = await materialProvider.getMaterial(params.slug);

    const { isSuccess, message, data } = res;

    if (isSuccess && data) {
      const m = data;
      setMaterialData({
        materialId: m.materialId,
        name: m.name,
        description: m.description ?? "",
        subjectId: m.subject.subjectId,
        gradeIds: m.materialGradeIds,
        updatedBy: "",
        image: m.image,
        imageFile: null,
      });
    } else {
      console.error(message ?? "Gagal memuat detail materi pelajaran");
      router.push("/dashboard/material");
    }
    setIsLoading(false);
  };

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
      router.push("/dashboard/material");
      return;
    }

    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    removeItem("materialDraft");

    setIsBackConfirmationModalVisible(false);
    router.push("/dashboard/material");
  };

  const handleEditMaterialSuccess = (values: EditMaterialFormInputs) => {
    console.log("Edit material successful with:", values);
    router.push("/dashboard/material");
  };

  useEffect(() => {
    if (params.slug) {
      fetchMaterialDetail();
    }
  }, [params.slug]);

  useEffect(() => {
    fetchSubjects();
    fetchGrades();
  }, []);

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Materi Pelajaran" showBackButton={true} />
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
