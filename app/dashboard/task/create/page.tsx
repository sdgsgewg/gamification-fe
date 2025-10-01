"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { gradeProvider } from "@/app/functions/GradeProvider";
import CreateTaskOverviewForm from "@/app/components/forms/tasks/task-overview/create-task-overview-form";
import CreateTaskQuestionForm from "@/app/components/forms/tasks/task-question/create-task-question-form";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { CreateTaskRequest } from "@/app/interface/tasks/requests/ICreateTaskRequest";
import toast from "react-hot-toast";
import { taskProvider } from "@/app/functions/TaskProvider";
import ModifyTaskSummaryContent from "@/app/components/pages/Dashboard/Task/ModifyTaskSummaryContent";
import { materialProvider } from "@/app/functions/MaterialProvider";
import {
  createTaskOverviewDefaultValues,
  CreateTaskOverviewFormInputs,
} from "@/app/schemas/tasks/task-overview/createTaskOverview";
import { CreateTaskQuestionFormInputs } from "@/app/schemas/tasks/task-questions/createTaskQuestion";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ViewState } from "@/app/types/task";

const CreateTaskPage = () => {
  const router = useRouter();
  const [subjectData, setSubjectData] = useState<SubjectOverviewResponse[]>([]);
  const [materialData, setMaterialData] = useState<MaterialOverviewResponse[]>(
    []
  );
  const [taskTypeData, setTaskTypeData] = useState<TaskTypeOverviewResponse[]>(
    []
  );
  const [gradeData, setGradeData] = useState<GradeOverviewResponse[]>([]);
  const [view, setView] = useState<ViewState>("task-overview");
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const [taskOverview, setTaskOverview] =
    useState<CreateTaskOverviewFormInputs>(createTaskOverviewDefaultValues);
  const [taskQuestions, setTaskQuestions] =
    useState<CreateTaskQuestionFormInputs | null>(null);

  const formRef = useRef<FormRef<CreateTaskOverviewFormInputs>>(null);

  const fetchSubjects = async () => {
    const res = await subjectProvider.getSubjects();
    if (res.isSuccess && res.data) setSubjectData(res.data);
  };

  const fetchMaterials = async () => {
    const res = await materialProvider.getMaterials();
    if (res.isSuccess && res.data) setMaterialData(res.data);
  };

  const fetchTaskTypes = async () => {
    const res = await taskTypeProvider.getTaskTypes();
    if (res.isSuccess && res.data) setTaskTypeData(res.data);
  };

  const fetchGrades = async () => {
    const res = await gradeProvider.getGrades();
    if (res.isSuccess && res.data) setGradeData(res.data);
  };

  const handleBack = () => {
    const values = formRef.current?.values;
    const isDirty = formRef.current?.isDirty;

    if (values) {
      setTaskOverview({
        ...createTaskOverviewDefaultValues,
        ...values,
      });
    }

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

  // STEP 1: Overview
  const handleTaskOverviewSubmit = (values: CreateTaskOverviewFormInputs) => {
    setTaskOverview(values);
    setView("task-question");
  };

  // STEP 2: Questions
  const handleTaskQuestionsBack = (qs: CreateTaskQuestionFormInputs) => {
    setTaskQuestions(qs);
    setView("task-overview");
  };

  const handleTaskQuestionsSubmit = (qs: CreateTaskQuestionFormInputs) => {
    setTaskQuestions(qs);
    setView("task-summary");
  };

  // STEP 3: Final Submit
  const handleFinalSubmit = async () => {
    if (!taskOverview || !taskQuestions) return;

    try {
      // Append semua data text sebagai JSON
      const payload: CreateTaskRequest = {
        title: taskOverview.title,
        description: taskOverview.description,
        creatorId: taskOverview.creatorId,
        subjectId: taskOverview.subjectId,
        materialId:
          taskOverview.materialId === "" ? null : taskOverview.materialId,
        taskTypeId: taskOverview.taskTypeId,
        gradeIds: taskOverview.gradeIds,
        createdBy: taskOverview.createdBy,
        startTime: taskOverview.startTime ?? null,
        endTime: taskOverview.endTime ?? null,
        questions: taskQuestions.questions.map((q) => ({
          text: q.text,
          point: q.point,
          type: q.type,
          timeLimit: q.timeLimit,
          options:
            q.options?.map((opt, idx) => ({
              text: opt.text,
              isCorrect: q.correctAnswer === idx.toString(),
            })) || [],
        })),
      };

      // Debug log payload object
      console.log(
        "Payload Final Submit JSON:",
        JSON.stringify(payload, null, 2)
      );

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // Append file images
      if (taskOverview.imageFile instanceof File) {
        formData.append("imageFile", taskOverview.imageFile);
      }

      // Append question images
      taskQuestions.questions.forEach((q, i) => {
        if (q.imageFile instanceof File) {
          formData.append(`questionImage_${i}`, q.imageFile);
        }
      });

      // Kalau mau lihat isi FormData:
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const result = await taskProvider.createTask(formData);

      if (result.isSuccess) {
        toast.success("Tugas berhasil dibuat!");
        router.push("/dashboard/task");
      } else {
        toast.error(result.message || "Gagal membuat tugas");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Terjadi kesalahan saat mengirim data");
    }
  };

  const TaskOverviewView = () => {
    return (
      <>
        <DashboardTitle title="Buat Tugas" onBack={handleBack} />
        <CreateTaskOverviewForm
          ref={formRef}
          taskOverview={taskOverview}
          subjectData={subjectData}
          materialData={materialData}
          taskTypeData={taskTypeData}
          gradeData={gradeData}
          onNext={handleTaskOverviewSubmit}
        />
      </>
    );
  };

  const TaskQuestionView = () => {
    return (
      <>
        <DashboardTitle title="Buat Soal" showBackButton={false} />
        <CreateTaskQuestionForm
          taskQuestions={taskQuestions}
          onBack={handleTaskQuestionsBack}
          onNext={handleTaskQuestionsSubmit}
        />
      </>
    );
  };

  const TaskSummaryView = () => {
    if (!taskOverview || !taskQuestions) {
      return;
    }

    const payload: CreateTaskRequest = {
      ...taskOverview,
      ...taskQuestions,
    };

    const handleBack = () => {
      setView("task-question");
    };

    return (
      <>
        <DashboardTitle title="Ringkasan Tugas" showBackButton={false} />
        <ModifyTaskSummaryContent
          payload={payload}
          subjectData={subjectData}
          materialData={materialData}
          taskTypeData={taskTypeData}
          gradeData={gradeData}
          onBack={handleBack}
          onSubmit={handleFinalSubmit}
        />
      </>
    );
  };

  useEffect(() => {
    fetchSubjects();
    fetchMaterials();
    fetchTaskTypes();
    fetchGrades();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      {view === "task-overview" ? (
        <TaskOverviewView />
      ) : view === "task-question" ? (
        <TaskQuestionView />
      ) : (
        <TaskSummaryView />
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

export default CreateTaskPage;
