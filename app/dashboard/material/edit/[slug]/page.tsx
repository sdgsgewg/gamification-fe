"use client";

import React, { useEffect, useState } from "react";
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

const EditMaterialPage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [materialData, setMaterialData] =
    useState<MaterialDetailResponse | null>(null);
  const [subjectData, setSubjectData] = useState<SubjectOverviewResponse[]>([]);
  const [gradeData, setGradeData] = useState<GradeOverviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMaterialDetail = async () => {
    setIsLoading(true);

    try {
      const res = await materialProvider.getMaterial(params.slug);
      if (res.isSuccess && res.data) {
        const m = res.data;
        setMaterialData({
          materialId: m.materialId,
          name: m.name,
          slug: m.slug,
          description: m.description ?? "",
          image: m.image,
          subject: m.subject || { subjectId: "", name: "" },
          materialGradeIds: m.materialGradeIds,
          materialGrade: m.materialGrade,
          updatedBy: "",
        });
      } else {
        message.error("Gagal memuat detail materi");
        router.push("/dashboard/material");
      }
    } catch (error) {
      console.error("Failed to fetch material details: ", error);
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (params.slug) {
      fetchMaterialDetail();
    }
  }, [params.slug]);

  useEffect(() => {
    fetchSubjects();
    fetchGrades();
  }, []);

  const handleEditMaterialSuccess = (values: EditMaterialFormInputs) => {
    console.log("Edit material successful with:", values);
    router.push("/dashboard/material");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Edit Materi Pelajaran" showBackButton={true} />
      {materialData && (
        <EditMaterialForm
          defaultValues={materialData}
          subjectData={subjectData}
          gradeData={gradeData}
          onFinish={handleEditMaterialSuccess}
        />
      )}
    </>
  );
};

export default EditMaterialPage;
