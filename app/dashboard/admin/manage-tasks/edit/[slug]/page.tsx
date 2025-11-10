"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useParams, useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import toast from "react-hot-toast";
import { taskProvider } from "@/app/functions/TaskProvider";
import ModifyTaskSummaryContent from "@/app/components/pages/Dashboard/Task/ModifyTaskSummaryContent";
import {
  editTaskOverviewDefaultValues,
  EditTaskOverviewFormInputs,
} from "@/app/schemas/tasks/task-overview/editTaskOverview";
import { EditTaskQuestionFormInputs } from "@/app/schemas/tasks/task-questions/editTaskQuestion";
import EditTaskOverviewForm from "@/app/components/forms/tasks/task-overview/edit-task-overview-form";
import { UpdateTaskRequest } from "@/app/interface/tasks/requests/IUpdateTaskRequest";
import EditTaskQuestionForm from "@/app/components/forms/tasks/task-question/edit-task-question-form";
import { QuestionType } from "@/app/enums/QuestionType";
import { parseDate } from "@/app/utils/date";
import Loading from "@/app/components/shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ViewState } from "@/app/types/task";
import { ROUTES } from "@/app/constants/routes";
import { useTaskDetail } from "@/app/hooks/tasks/useTaskDetail";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useGrades } from "@/app/hooks/grades/useGrades";

const EditTaskPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS;

  const { data: taskData, isLoading: isTaskDataLoading } = useTaskDetail(
    params.slug,
    "edit"
  );
  const { data: subjectData = [] } = useSubjects();
  const { data: materialData = [] } = useMaterials();
  const { data: taskTypeData = [] } = useTaskTypes();
  const { data: gradeData = [] } = useGrades();

  const [view, setView] = useState<ViewState>("task-overview");
  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "",
  });

  const [taskOverviewDefaultValue, setTaskOverviewDefaultValue] =
    useState<EditTaskOverviewFormInputs>(editTaskOverviewDefaultValues);
  const [taskOverview, setTaskOverview] = useState<EditTaskOverviewFormInputs>(
    editTaskOverviewDefaultValues
  );
  const [taskQuestionsDefaultValue, setTaskQuestionsDefaultValue] =
    useState<EditTaskQuestionFormInputs | null>(null);
  const [taskQuestions, setTaskQuestions] =
    useState<EditTaskQuestionFormInputs | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formRef = useRef<FormRef<EditTaskOverviewFormInputs>>(null);

  const handleBack = () => {
    const values = formRef.current?.values;
    const isDirty = formRef.current?.isDirty;

    if (values) {
      setTaskOverview({
        ...editTaskOverviewDefaultValues,
        ...values,
      });
    }

    if (!isDirty) {
      router.back();
      return;
    }

    setBackConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleBackConfirmation = () => {
    setBackConfirmationModal((prev) => ({ ...prev, visible: false }));
    router.back();
  };

  // STEP 1: Overview
  const handleTaskOverviewSubmit = (values: EditTaskOverviewFormInputs) => {
    setTaskOverview(values);
    setView("task-question");
  };

  // STEP 2: Questions
  const handleTaskQuestionsBack = (qs: EditTaskQuestionFormInputs) => {
    setTaskQuestions(qs);
    setView("task-overview");
  };

  // STEP 2: Questions
  // const handleTaskQuestionsBack = (qs: EditTaskQuestionFormInputs) => {
  //   // Transformasi data untuk memastikan konsistensi
  //   const transformedQuestions = {
  //     ...qs,
  //     questions: qs.questions.map((q) => {
  //       // multiple choice
  //       if (
  //         q.type === QuestionType.MULTIPLE_CHOICE &&
  //         q.correctAnswer !== undefined
  //       ) {
  //         const correctIndex = parseInt(q.correctAnswer as string, 10);

  //         return {
  //           ...q,
  //           options: q.options
  //             ? q.options.map((opt, i) => ({
  //                 ...opt,
  //                 isCorrect: i === correctIndex,
  //               }))
  //             : [],
  //         };
  //       }

  //       // true/false
  //       if (q.type === QuestionType.TRUE_FALSE) {
  //         return {
  //           ...q,
  //           options: q.options
  //             ? q.options.map((opt) => ({
  //                 ...opt,
  //                 isCorrect:
  //                   ((opt.text === "True" || opt.text === "Benar") &&
  //                     q.correctAnswer === "true") ||
  //                   ((opt.text === "False" || opt.text === "Salah") &&
  //                     q.correctAnswer === "false"),
  //               }))
  //             : [],
  //         };
  //       }

  //       // fill in the blank
  //       if (q.type === QuestionType.FILL_BLANK) {
  //         return {
  //           ...q,
  //           options: [
  //             {
  //               text: String(q.correctAnswer),
  //               isCorrect: true,
  //             },
  //           ],
  //         };
  //       }

  //       // essay biarkan default
  //       return q;
  //     }),
  //   };

  //   setTaskQuestions(transformedQuestions);
  //   setView("task-overview");
  // };

  const handleTaskQuestionsSubmit = (qs: EditTaskQuestionFormInputs) => {
    setTaskQuestions(qs);
    setView("task-summary");
  };

  // STEP 3: Final Submit
  const handleFinalSubmit = async () => {
    if (!taskData || !taskOverview || !taskQuestions) return;

    setIsLoading(true);

    try {
      // Append semua data text sebagai JSON
      const payload: UpdateTaskRequest = {
        title: taskOverview.title,
        description: taskOverview.description,
        subjectId: taskOverview.subjectId,
        materialId: taskOverview.materialId ?? "",
        taskTypeId: taskOverview.taskTypeId,
        gradeIds: taskOverview.gradeIds,
        difficulty: taskOverview.difficulty,
        updatedBy: taskOverview.updatedBy,
        startTime: taskOverview.startTime,
        endTime: taskOverview.endTime,
        imageFile: taskOverview.imageFile,
        questions: taskQuestions.questions.map((q) => ({
          questionId: q.questionId ?? "",
          text: q.text,
          point: q.point,
          type: q.type,
          timeLimit: q.timeLimit,
          options:
            q.options?.map((opt) => ({
              optionId: opt.optionId ?? "",
              text: opt.text,
              isCorrect: opt.isCorrect,
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

      const result = await taskProvider.updateTask(taskData.taskId, formData);

      if (result.isSuccess) {
        toast.success("Tugas berhasil diperbarui!");
        router.push(`${baseRoute}`);
      } else {
        toast.error(result.message || "Gagal memperbarui tugas");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Terjadi kesalahan saat mengirim data");
    } finally {
      setIsLoading(false);
    }
  };

  const TaskOverviewView = () => {
    return (
      <>
        <DashboardTitle
          title="Edit Tugas"
          showBackButton={true}
          onBack={handleBack}
        />
        <EditTaskOverviewForm
          ref={formRef}
          taskOverviewDefaultValue={taskOverviewDefaultValue}
          taskOverview={taskOverview}
          taskQuestionsDefaultValue={taskQuestionsDefaultValue}
          taskQuestions={taskQuestions}
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
        <DashboardTitle title="Edit Soal" showBackButton={false} />
        <EditTaskQuestionForm
          taskOverview={taskOverview}
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

    const payload: UpdateTaskRequest = {
      title: taskOverview.title,
      description: taskOverview.description,
      subjectId: taskOverview.subjectId,
      materialId: taskOverview.materialId ?? "",
      taskTypeId: taskOverview.taskTypeId,
      gradeIds: taskOverview.gradeIds,
      difficulty: taskOverview.difficulty,
      updatedBy: taskOverview.updatedBy,
      startTime: taskOverview.startTime,
      endTime: taskOverview.endTime,
      imageFile: taskOverview.imageFile ?? taskOverview.image,
      questions: taskQuestions.questions.map((q) => ({
        questionId: q.questionId ?? "",
        text: q.text,
        point: q.point,
        type: q.type,
        timeLimit: q.timeLimit,
        imageFile: q.imageFile ?? q.image,
        options:
          q.options?.map((opt) => ({
            optionId: opt.optionId ?? "",
            text: opt.text,
            isCorrect: opt.isCorrect,
          })) || [],
      })),
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
    if (!taskData) return;

    const {
      title,
      description,
      subject,
      material,
      taskType,
      taskGradeIds,
      difficulty,
      duration,
      image,
    } = taskData;
    const { updatedBy } = taskData.history;

    const defaultTaskOverview = {
      title: title,
      description: description ?? "",
      subjectId: subject.subjectId,
      materialId: material?.materialId,
      taskTypeId: taskType.taskTypeId,
      gradeIds: taskGradeIds,
      difficulty: difficulty.toUpperCase(),
      updatedBy: updatedBy ?? "",
      startDate: parseDate(duration?.startTime),
      startTime: parseDate(duration?.startTime),
      endDate: parseDate(duration?.endTime),
      endTime: parseDate(duration?.endTime),
      image: image,
      imageFile: undefined,
    };

    setTaskOverviewDefaultValue(defaultTaskOverview);
    setTaskOverview(defaultTaskOverview);

    const defaultTaskQuestions = {
      questions: taskData.questions.map((q) => {
        // multiple choice
        if (q.type === QuestionType.MULTIPLE_CHOICE) {
          const correctIndex = q.options?.findIndex((o) => o.isCorrect) ?? -1;
          return {
            ...q,
            type: q.type as QuestionType,
            imageFile: undefined,
            correctAnswer: correctIndex !== -1 ? correctIndex.toString() : "",
          };
        }

        // true or false
        if (q.type === QuestionType.TRUE_FALSE) {
          const correctOpt = q.options?.find((o) => o.isCorrect);
          return {
            ...q,
            type: q.type as QuestionType,
            imageFile: undefined,
            options: [
              {
                text: "True",
                isCorrect:
                  correctOpt?.text === "Benar" || correctOpt?.text === "True",
              },
              {
                text: "False",
                isCorrect:
                  correctOpt?.text === "Salah" || correctOpt?.text === "False",
              },
            ],
            correctAnswer:
              correctOpt?.text === "Benar" || correctOpt?.text === "True"
                ? "true"
                : "false",
          };
        }

        // fill in the blanks
        if (q.type === QuestionType.FILL_BLANK) {
          const correctOpt = q.options?.find((o) => o.isCorrect);
          return {
            ...q,
            type: q.type as QuestionType,
            imageFile: undefined,
            correctAnswer: correctOpt?.text ?? "",
          };
        }

        // essay -> tidak ada correctAnswer
        return {
          ...q,
          type: q.type as QuestionType,
          imageFile: undefined,
          correctAnswer: "",
        };
      }),
    };

    setTaskQuestionsDefaultValue(defaultTaskQuestions);
    setTaskQuestions(defaultTaskQuestions);
  }, [taskData]);

  return (
    <>
      {isTaskDataLoading || (isLoading && <Loading />)}

      <Toaster position="top-right" />
      {view === "task-overview" ? (
        <TaskOverviewView />
      ) : view === "task-question" ? (
        <TaskQuestionView />
      ) : (
        <TaskSummaryView />
      )}

      <ConfirmationModal
        visible={backConfirmationModal.visible}
        type="back"
        onConfirm={handleBackConfirmation}
        onCancel={() =>
          setBackConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />
    </>
  );
};

export default EditTaskPage;
