"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { message } from "antd";
import { Toaster } from "@/app/hooks/use-toast";

import Loading from "@/app/components/shared/Loading";
import EditTaskTypeForm from "@/app/components/forms/task-types/edit-task-type-form";
import { TaskTypeDetailResponse } from "@/app/interface/task-types/responses/ITaskTypeDetailResponse";
import { EditTaskTypeFormInputs } from "@/app/schemas/task-types/editTaskType";

const EditTaskTypePage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [taskTypeData, setTaskTypeData] =
    useState<TaskTypeDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTaskTypeDetail = async () => {
    setIsLoading(true);

    try {
      const res = await taskTypeProvider.getTaskType(params.slug);
      if (res.isSuccess && res.data) {
        const tt = res.data;

        console.log("Task Type Detail Data: ", JSON.stringify(tt, null, 2));

        setTaskTypeData({
          taskTypeId: tt.taskTypeId,
          name: tt.name,
          slug: tt.slug || "",
          description: tt.description || "",
          scope: tt.scope || "",
          hasDeadline: tt.hasDeadline,
          isCompetitive: tt.isCompetitive,
          isRepeatable: tt.isRepeatable,
          pointMultiplier: tt.pointMultiplier,
          updatedBy: "",
        });
      } else {
        message.error("Gagal memuat detail tipe tugas");
        router.push("/dashboard/task-type");
      }
    } catch (error) {
      console.error("Failed to fetch task type details: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) {
      fetchTaskTypeDetail();
    }
  }, [params.slug]);

  const handleEdittaskTypeSuccess = (values: EditTaskTypeFormInputs) => {
    console.log("Edit task type successful with:", values);
    router.push("/dashboard/task-type");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Edit Tipe Tugas" showBackButton={true} />
      {taskTypeData && (
        <EditTaskTypeForm
          defaultValues={taskTypeData}
          onFinish={handleEdittaskTypeSuccess}
        />
      )}
    </>
  );
};

export default EditTaskTypePage;
