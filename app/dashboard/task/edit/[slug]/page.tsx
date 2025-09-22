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
import { setItem } from "@/app/utils/storage";
import { TaskDetailResponse } from "@/app/interface/tasks/responses/ITaskDetailResponse";
import { message } from "antd";
import { EditTaskOverviewFormInputs } from "@/app/schemas/tasks/task-overview/editTaskOverview";
import { EditTaskQuestionFormInputs } from "@/app/schemas/tasks/task-questions/editTaskQuestion";
import EditTaskOverviewForm, {
  EditTaskOverviewFormRef,
} from "@/app/components/forms/tasks/task-overview/edit-task-overview-form";
import { UpdateTaskRequest } from "@/app/interface/tasks/requests/IUpdateTaskRequest";
import EditTaskQuestionForm from "@/app/components/forms/tasks/task-question/edit-task-question-form";
import { QuestionType } from "@/app/enums/QuestionType";
import { parseDate } from "@/app/utils/date";
import Loading from "@/app/components/shared/Loading";

type ViewState = "task-overview" | "task-question" | "task-summary";

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

  const [taskOverview, setTaskOverview] =
    useState<EditTaskOverviewFormInputs | null>(null);
  const [taskQuestions, setTaskQuestions] =
    useState<EditTaskQuestionFormInputs | null>(null);

  const formRef = useRef<EditTaskOverviewFormRef>(null);

  const fetchTaskDetail = async () => {
    setIsLoading(true);

    try {
      const res = await taskProvider.getTask(params.slug);
      if (res.isSuccess && res.data) {
        const t = res.data;
        setTaskData({
          taskId: t.taskId,
          title: t.title,
          slug: t.slug,
          description: t.description,
          image: t.image,
          subject: t.subject ?? { subjectId: "", name: "" },
          material: t.material ?? { materialId: "", name: "" },
          taskType: t.taskType ?? { taskTypeId: "", name: "" },
          taskGradeIds: t.taskGradeIds,
          taskGrade: t.taskGrade,
          questionCount: t.questionCount,
          startTime: t.startTime,
          endTime: t.endTime,
          duration: t.duration,
          createdBy: t.createdBy,
          updatedBy: t.updatedBy,
          questions:
            t.questions?.map((q) => ({
              questionId: q.questionId,
              text: q.text,
              point: q.point,
              type: q.type,
              timeLimit: q.timeLimit,
              image: q.image,
              options: q.options?.map((o) => ({
                optionId: o.optionId,
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            })) || [],
        });
      } else {
        message.error("Gagal memuat detail tugas");
        router.push("/dashboard/task");
      }
    } catch (error) {
      console.error("Failed to fetch task details: ", error);
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

  const fetchMaterials = async () => {
    try {
      const res = await materialProvider.getMaterials();
      if (res.isSuccess && res.data) setMaterialData(res.data);
    } catch (error) {
      console.error("Failed to fetch materials: ", error);
    }
  };

  const fetchTaskTypes = async () => {
    try {
      const res = await taskTypeProvider.getTaskTypes();
      if (res.isSuccess && res.data) setTaskTypeData(res.data);
    } catch (error) {
      console.error("Failed to fetch task types: ", error);
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

  // STEP 1: Overview
  const handleTaskOverviewSubmit = (values: EditTaskOverviewFormInputs) => {
    console.log("Task overview submit data: ", JSON.stringify(values, null, 2));

    setTaskOverview(values);
    setView("task-question");
  };

  // STEP 2: Questions
  const handleTaskQuestionsSubmit = (qs: EditTaskQuestionFormInputs) => {
    console.log("Task question submit data: ", JSON.stringify(qs, null, 2));

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
            q.options?.map((opt, idx) => ({
              optionId: opt.optionId ?? "",
              text: opt.text,
              // isCorrect: q.correctAnswer === idx.toString(),
              isCorrect: opt.isCorrect,
            })) || [],
        })),
      };

      // ✅ Debug log payload object
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
      console.log("Isi FormData:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

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

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;
    const hasData = Boolean(taskOverview) || isDirty;

    if (!hasData) {
      router.push("/dashboard/task");
      return;
    }

    console.log("Tetap di task overview: ", isDirty);
    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    // Simpan draft kosong
    setItem(
      "taskOverviewDraft",
      JSON.stringify({
        title: "",
        description: "",
        creatorId: "",
        createdBy: "",
        subjectId: "",
        materialId: "",
        taskTypeId: "",
        gradeIds: [],
        startDate: undefined,
        startTime: undefined,
        endDate: undefined,
        endTime: undefined,
        imageFile: undefined,
      })
    );

    setIsBackConfirmationModalVisible(false);
    router.push("/dashboard/task");
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
        <DashboardTitle title="Edit Soal" showBackButton={false} />
        <EditTaskQuestionForm
          taskQuestions={taskQuestions}
          onBack={() => setView("task-overview")}
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
          q.options?.map((opt, idx) => ({
            optionId: opt.optionId ?? "",
            text: opt.text,
            isCorrect: opt.isCorrect,
          })) || [],
      })),
    };

    console.log(
      "Hasil payload view task summary: ",
      JSON.stringify(payload, null, 2)
    );

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

    console.log("Task data (index page): ", JSON.stringify(taskData, null, 2));

    setTaskOverview({
      title: taskData.title,
      description: taskData.description,
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
    });

    setTaskQuestions({
      questions: taskData.questions.map((q) => {
        if (q.type === QuestionType.MULTIPLE_CHOICE) {
          const correctIndex = q.options?.findIndex((o) => o.isCorrect) ?? -1;
          return {
            ...q,
            type: q.type as QuestionType,
            imageFile: undefined,
            correctAnswer: correctIndex !== -1 ? correctIndex.toString() : "",
          };
        }

        if (q.type === QuestionType.TRUE_FALSE) {
          const correctOpt = q.options?.find((o) => o.isCorrect);
          return {
            ...q,
            type: q.type as QuestionType,
            imageFile: undefined,
            correctAnswer: correctOpt?.text === "Benar" ? "true" : "false",
          };
        }

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
    });
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
