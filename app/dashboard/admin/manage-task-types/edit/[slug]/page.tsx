"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import EditTaskTypeForm from "@/app/components/forms/task-types/edit-task-type-form";
import { EditTaskTypeFormInputs } from "@/app/schemas/task-types/editTaskType";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const EditTaskTypePage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [taskTypeData, setTaskTypeData] =
    useState<EditTaskTypeFormInputs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<FormRef>(null);

  const fetchTaskTypeDetail = async () => {
    setIsLoading(true);

    const res = await taskTypeProvider.getTaskType(params.slug);

    const { isSuccess, message, data } = res;

    if (isSuccess && data) {
      const tt = data;
      setTaskTypeData({
        taskTypeId: tt.taskTypeId,
        name: tt.name,
        description: tt.description || "",
        scope: tt.scope || "",
        hasDeadline: tt.hasDeadline.toString(),
        isCompetitive: tt.isCompetitive.toString(),
        isRepeatable: tt.isRepeatable.toString(),
        pointMultiplier: tt.pointMultiplier,
        updatedBy: "",
      });
    } else {
      console.error(message ?? "Gagal memuat detail tipe tugas");
      router.push("/dashboard/task-type");
    }

    setIsLoading(false);
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

  const handleEdittaskTypeSuccess = (values: EditTaskTypeFormInputs) => {
    console.log("Edit task type successful with:", values);
    router.push("/dashboard/task-type");
  };

  useEffect(() => {
    if (params.slug) {
      fetchTaskTypeDetail();
    }
  }, [params.slug]);

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Tipe Tugas" onBack={handleBack} />
      {taskTypeData && (
        <EditTaskTypeForm
          ref={formRef}
          taskTypeData={taskTypeData}
          onFinish={handleEdittaskTypeSuccess}
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

export default EditTaskTypePage;
