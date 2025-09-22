"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CreateTaskTypeFormInputs } from "@/app/schemas/task-types/createTaskType";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import CreateTaskTypeForm from "@/app/components/forms/task-types/create-task-type-form";

const CreateTaskTypePage = () => {
  const router = useRouter();

  const handleCreateTaskTypeSuccess = (values: CreateTaskTypeFormInputs) => {
    console.log("Create task type successful with:", values);
    router.push("/dashboard/task-type");
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Buat Tipe Tugas Baru" showBackButton={true} />
      <CreateTaskTypeForm onFinish={handleCreateTaskTypeSuccess} />
    </>
  );
};

export default CreateTaskTypePage;
