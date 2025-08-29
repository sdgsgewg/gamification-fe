"use client";

import React from "react";
import CreateSubjectForm, {
  CreateSubjectFormInputs,
} from "@/app/components/forms/subjects/create-subject-form";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";

const CreateSubjectPage = () => {
  const router = useRouter();

  const handleCreateSubjectSuccess = (values: CreateSubjectFormInputs) => {
    console.log("Create subject successful with:", values);
    router.push("/dashboard/subject");
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Buat Mata Pelajaran Baru" showBackButton={true} />
      <CreateSubjectForm onFinish={handleCreateSubjectSuccess} />
    </>
  );
};

export default CreateSubjectPage;
