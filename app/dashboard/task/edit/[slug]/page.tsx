"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useParams, useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import toast from "react-hot-toast";
import { taskProvider } from "@/app/functions/TaskProvider";
import ModifyTaskSummaryContent from "@/app/components/pages/Dashboard/Task/ModifyTaskSummaryContent";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { TaskDetailResponse } from "@/app/interface/tasks/responses/ITaskDetailResponse";
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

const EditTaskPage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [taskData, setTaskData] = useState<TaskDetailResponse | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);

  const [taskOverviewDefaultValue, setTaskOverviewDefaultValue] =
    useState<EditTaskOverviewFormInputs>(editTaskOverviewDefaultValues);
  const [taskOverview, setTaskOverview] = useState<EditTaskOverviewFormInputs>(
    editTaskOverviewDefaultValues
  );
  const [taskQuestionsDefaultValue, setTaskQuestionsDefaultValue] =
    useState<EditTaskQuestionFormInputs | null>(null);
  const [taskQuestions, setTaskQuestions] =
    useState<EditTaskQuestionFormInputs | null>(null);

  const formRef = useRef<FormRef<EditTaskOverviewFormInputs>>(null);

  const fetchTaskDetail = async () => {
    setIsLoading(true);

    const res = await taskProvider.getTask(params.slug);
    const { isSuccess, message, data } = res;
    if (isSuccess && data) {
      setTaskData({ ...data, updatedBy: "" });
    } else {
      console.error(message ?? "Gagal memuat detail tugas");
      router.push("/dashboard/task");
    }
    setIsLoading(false);
  };

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

    console.log("Is Dirty (index page): ", isDirty);

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

    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    setIsBackConfirmationModalVisible(false);
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

  const handleTaskQuestionsSubmit = (qs: EditTaskQuestionFormInputs) => {
    setTaskQuestions(qs);
    setView("task-summary");
  };

  // STEP 3: Final Submit
  const handleFinalSubmit = async () => {
    if (!taskData || !taskOverview || !taskQuestions) return;

    try {
      // Append semua data text sebagai JSON
      const payload: UpdateTaskRequest = {
        title: taskOverview.title,
        description: taskOverview.description,
        subjectId: taskOverview.subjectId,
        materialId: taskOverview.materialId ?? "",
        taskTypeId: taskOverview.taskTypeId,
        gradeIds: taskOverview.gradeIds,
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
        router.push("/dashboard/task");
      } else {
        toast.error(result.message || "Gagal memperbarui tugas");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Terjadi kesalahan saat mengirim data");
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
    if (params.slug) {
      fetchTaskDetail();
    }
  }, [params.slug]);

  useEffect(() => {
    if (!taskData) return;

    const defaultTaskOverview = {
      title: taskData.title,
      description: taskData.description ?? "",
      subjectId: taskData.subject.subjectId,
      materialId: taskData.material?.materialId,
      taskTypeId: taskData.taskType.taskTypeId,
      gradeIds: taskData.taskGradeIds,
      updatedBy: taskData.updatedBy ?? "",
      startDate: parseDate(taskData.startTime),
      startTime: parseDate(taskData.startTime),
      endDate: parseDate(taskData.endTime),
      endTime: parseDate(taskData.endTime),
      image: taskData.image,
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
            correctAnswer: correctOpt?.text === "Benar" ? "true" : "false",
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

    console.log("Default task questions: ", defaultTaskQuestions);

    setTaskQuestionsDefaultValue(defaultTaskQuestions);
    setTaskQuestions(defaultTaskQuestions);
  }, [taskData]);

  useEffect(() => {
    fetchSubjects();
    fetchMaterials();
    fetchTaskTypes();
    fetchGrades();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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

export default EditTaskPage;
