"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AttemptTaskQuestionCard } from "@/app/components/shared/cards";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { UpdateTaskAttemptFormInputs } from "@/app/schemas/task-attempts/updateTaskAttempt";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import Loading from "@/app/components/shared/Loading";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { MessageModal } from "@/app/components/modals/MessageModal";
import { useClassTaskWithQuestions } from "@/app/hooks/class-tasks/useClassTaskWithQuestions";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import QuestionNavigationBar from "@/app/components/shared/navigation-bar/QuestionNavigationBar";
import NavigationBarWrapper from "@/app/components/shared/NavigationBarWrapper";

export const dynamic = "force-dynamic";

const StudentAttemptTaskPageContent = () => {
  const searchParams = useSearchParams();
  const { user } = useGetCachedUser();
  const router = useRouter();

  const [classSlug, setClassSlug] = useState<string>("");
  const [taskSlug, setTaskSlug] = useState<string>("");

  useEffect(() => {
    if (searchParams) {
      const cSlug = searchParams.get("class") ?? "";
      const tSlug = searchParams.get("task") ?? "";

      setClassSlug(cSlug);
      setTaskSlug(tSlug);
    }
  }, [searchParams]);

  const { data: classTaskData, isLoading: isClassTaskDataLoading } =
    useClassTaskWithQuestions(classSlug, taskSlug);
  const { data: classData, isLoading: isClassDataLoading } = useClassDetail(
    classSlug,
    "detail"
  );

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [lastAccessedAt, setLastAccessedAt] = useState<Date | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "Are you sure you want to go back? All progress will be saved.",
  });

  const [submitConfirmationModal, setSubmitConfirmationModal] = useState({
    visible: false,
    text: "Are you sure you want to submit this assignment? Please check it again.",
  });

  const [messageModal, setMessageModal] = useState({
    visible: false,
    isSuccess: true,
    text: "",
    type: null as "submit" | "back" | null,
  });

  // Catat waktu attempt (startedAt & lastAccessedAt)
  useEffect(() => {
    const key = `activity_${taskSlug}_startedAt`;
    const existingStart = sessionStorage.getItem(key);
    const now = new Date();

    if (existingStart) {
      setStartedAt(new Date(existingStart));
    } else {
      sessionStorage.setItem(key, now.toISOString());
      setStartedAt(now);
    }
    setLastAccessedAt(now);
  }, [taskSlug]);

  // Prefill answers ketika classTaskData berhasil dimuat
  useEffect(() => {
    if (!classTaskData) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya
    if (classTaskData.lastAttemptId) {
      const prefilledAnswers: Record<string, any> = {};

      classTaskData.questions.forEach((q) => {
        if (q.userAnswer) {
          prefilledAnswers[q.questionId] = {
            optionId: q.userAnswer.optionId,
            answerText: q.userAnswer.text,
          };
        } else if (q.options) {
          // Backup: cek dari option yang memiliki isSelected = true
          const selectedOption = q.options.find((opt) => opt.isSelected);
          if (selectedOption) {
            prefilledAnswers[q.questionId] = {
              optionId: selectedOption.optionId,
              answerText: null,
            };
          }
        }
      });

      setAnswers(prefilledAnswers);
    }
  }, [classTaskData]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], optionId, answerText: null },
    }));
  };

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], optionId: null, answerText: text },
    }));
  };

  if (!classTaskData || !classData) return <Loading />;

  const handleOpenBackConfirmation = () => {
    setBackConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleBackConfirmation = async () => {
    if (!user || !classTaskData || !startedAt || !lastAccessedAt) return;

    setBackConfirmationModal((prev) => ({ ...prev, visible: false }));

    // Cek apakah user sudah menjawab minimal 1 soal
    const hasAnswered = Object.values(answers).some(
      (a) => a.optionId || a.answerText
    );

    if (!hasAnswered) {
      // Tidak ada jawaban — langsung kembali tanpa autosave
      router.back();
      return;
    }

    setIsLoading(true);

    try {
      const answerLogs = classTaskData.questions.map((q) => ({
        questionId: q.questionId,
        answerLogId: q.userAnswer?.answerLogId ?? undefined,
        optionId: answers[q.questionId]?.optionId || null,
        answerText: answers[q.questionId]?.answerText || null,
      }));

      let result = null;

      // Update progres yang sudah ada
      const payload: UpdateTaskAttemptFormInputs = {
        answeredQuestionCount: answerLogs.filter(
          (a) => a.optionId || a.answerText
        ).length,
        status: TaskAttemptStatus.ON_PROGRESS,
        startedAt,
        lastAccessedAt,
        answerLogs: answerLogs
          .filter((a) => a.optionId || a.answerText)
          .map((a) => ({
            ...a,
            ...(a.answerLogId ? { answerLogId: a.answerLogId } : {}),
          })),
      };

      result = await taskAttemptProvider.updateClassTaskAttempt(
        classTaskData.lastAttemptId!,
        payload
      );

      setMessageModal({
        visible: true,
        isSuccess: result?.isSuccess ?? false,
        text: result?.isSuccess
          ? "Progress successfully saved."
          : "Failed to save progress.",
        type: "back",
      });
    } catch (err) {
      console.error("Error during autosave before returning:", err);
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "An error occurred while saving progress.",
        type: "back",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSubmitConfirmation = () => {
    setSubmitConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleSubmitConfirmation = async () => {
    if (!user || !classTaskData || !startedAt || !lastAccessedAt) return;

    setSubmitConfirmationModal((prev) => ({ ...prev, visible: false }));

    const totalQuestions = classTaskData.questions.length;
    const answeredCount = Object.values(answers).filter(
      (a) => a.optionId || a.answerText
    ).length;

    // Prevent submit jika semua soal belum terjawab
    if (answeredCount < totalQuestions) {
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Please answer all questions to complete the assignment.",
        type: "submit",
      });
      return;
    }

    setIsLoading(true);

    try {
      const answerLogs = classTaskData.questions.map((q) => ({
        questionId: q.questionId,
        answerLogId: q.userAnswer?.answerLogId ?? undefined,
        optionId: answers[q.questionId]?.optionId || null,
        answerText: answers[q.questionId]?.answerText || null,
      }));

      let result = null;

      const payload: UpdateTaskAttemptFormInputs = {
        answeredQuestionCount: answerLogs.filter(
          (a) => a.optionId || a.answerText
        ).length,
        status: TaskAttemptStatus.SUBMITTED,
        lastAccessedAt,
        answerLogs: answerLogs
          .filter((a) => a.optionId || a.answerText)
          .map((a) => ({
            ...a,
            ...(a.answerLogId ? { answerLogId: a.answerLogId } : {}),
          })),
      };

      console.log("Payload (Update): ", JSON.stringify(payload, null, 2));

      result = await taskAttemptProvider.updateClassTaskAttempt(
        classTaskData.lastAttemptId!,
        payload
      );

      setMessageModal({
        visible: true,
        isSuccess: result?.isSuccess ?? false,
        text: result?.isSuccess
          ? "The assignment has been successfully submitted."
          : "Assignment Not Submitted.",
        type: "submit",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageModalConfirmation = () => {
    setMessageModal((prev) => ({ ...prev, visible: false }));

    if (!messageModal.isSuccess) return;

    if (messageModal.type === "submit") {
      const query = new URLSearchParams();
      query.append("class", classSlug);
      query.append("task", taskSlug);
      const url = `${ROUTES.DASHBOARD.STUDENT.TASKS_SUMMARY}?${query}`;
      router.push(url);
    } else if (messageModal.type === "back") {
      router.back();
    }
  };

  const currentQuestion = classTaskData.questions[selectedQuestionIndex];

  return (
    <>
      {(isClassTaskDataLoading || isClassDataLoading || isLoading) && (
        <Loading />
      )}

      {/* Navigation Atas */}
      <NavigationBarWrapper
        onBack={handleOpenBackConfirmation}
        onNext={handleOpenSubmitConfirmation}
      />

      {/* Navigasi Soal */}
      <QuestionNavigationBar
        questions={classTaskData.questions}
        selectedQuestionIndex={selectedQuestionIndex}
        setSelectedQuestionIndex={setSelectedQuestionIndex}
        answers={answers}
        scrollContainerRef={scrollContainerRef}
      />

      {/* Tampilan Soal */}
      <AttemptTaskQuestionCard
        index={selectedQuestionIndex}
        question={currentQuestion}
        selectedOptionId={answers[currentQuestion.questionId]?.optionId}
        answerText={answers[currentQuestion.questionId]?.answerText}
        onOptionSelect={(optId) =>
          handleOptionSelect(currentQuestion.questionId, optId)
        }
        onAnswerChange={(text) =>
          handleAnswerChange(currentQuestion.questionId, text)
        }
      />

      <ConfirmationModal
        visible={backConfirmationModal.visible}
        text={backConfirmationModal.text}
        type="back"
        onConfirm={handleBackConfirmation}
        onCancel={() =>
          setBackConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />

      <ConfirmationModal
        visible={submitConfirmationModal.visible}
        text={submitConfirmationModal.text}
        type="submit"
        onConfirm={handleSubmitConfirmation}
        onCancel={() =>
          setSubmitConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />

      <MessageModal
        visible={messageModal.visible}
        isSuccess={messageModal.isSuccess}
        text={messageModal.text}
        onConfirm={handleMessageModalConfirmation}
      />
    </>
  );
};

export default function StudentAttemptTaskPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StudentAttemptTaskPageContent />
    </Suspense>
  )
}
