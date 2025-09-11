"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { Subject } from "@/app/interface/subjects/ISubject";
import { Grade } from "@/app/interface/grades/IGrade";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { gradeProvider } from "@/app/functions/GradeProvider";
import CreateMaterialForm, {
  CreateMaterialFormInputs,
} from "@/app/components/forms/materials/create-material-form";

const CreateMaterialPage = () => {
  const router = useRouter();
  const [subjectData, setSubjectData] = useState<Subject[]>([]);
  const [gradeData, setGradeData] = useState<Grade[]>([]);

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
    fetchSubjects();
    fetchGrades();
  }, []);

  const handleCreateMaterialSuccess = (values: CreateMaterialFormInputs) => {
    console.log("Create material successful with:", values);
    router.push("/dashboard/material");
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle
        title="Buat Materi Pelajaran Baru"
        showBackButton={true}
      />
      <CreateMaterialForm
        subjectData={subjectData}
        gradeData={gradeData}
        onFinish={handleCreateMaterialSuccess}
      />
    </>
  );
};

export default CreateMaterialPage;
