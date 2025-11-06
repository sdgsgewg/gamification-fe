"use client";

import React, { useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import CreateTaskOverviewForm from "@/app/components/forms/tasks/task-overview/create-task-overview-form";
import CreateTaskQuestionForm from "@/app/components/forms/tasks/task-question/create-task-question-form";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { CreateTaskRequest } from "@/app/interface/tasks/requests/ICreateTaskRequest";
import toast from "react-hot-toast";
import { taskProvider } from "@/app/functions/TaskProvider";
import ModifyTaskSummaryContent from "@/app/components/pages/Dashboard/Task/ModifyTaskSummaryContent";
import {
  createTaskOverviewDefaultValues,
  CreateTaskOverviewFormInputs,
} from "@/app/schemas/tasks/task-overview/createTaskOverview";
import { CreateTaskQuestionFormInputs } from "@/app/schemas/tasks/task-questions/createTaskQuestion";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ViewState } from "@/app/types/task";
import { ROUTES } from "@/app/constants/routes";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useGrades } from "@/app/hooks/grades/useGrades";

const CreateTaskPage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS;

  const { data: subjectData = [] } = useSubjects();
  const { data: materialData = [] } = useMaterials();
  const { data: taskTypeData = [] } = useTaskTypes();
  const { data: gradeData = [] } = useGrades();

  const [view, setView] = useState<ViewState>("task-overview");
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const [taskOverview, setTaskOverview] =
    useState<CreateTaskOverviewFormInputs>(createTaskOverviewDefaultValues);
  const [taskQuestions, setTaskQuestions] =
    useState<CreateTaskQuestionFormInputs | null>(null);

  const formRef = useRef<FormRef<CreateTaskOverviewFormInputs>>(null);

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
        difficulty: taskOverview.difficulty,
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
        router.push(`${baseRoute}`);
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
