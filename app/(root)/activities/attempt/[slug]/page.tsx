"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActivityWithQuestions } from "@/app/hooks/activities/useActivityWithQuestions";
import { AttemptTaskQuestionCard } from "@/app/components/shared/cards";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { CreateTaskAttemptFormInputs } from "@/app/schemas/task-attempts/createTaskAttempt";
import { UpdateTaskAttemptFormInputs } from "@/app/schemas/task-attempts/updateTaskAttempt";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import Loading from "@/app/components/shared/Loading";
import PageLayout from "@/app/(root)/page-layout";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { MessageModal } from "@/app/components/modals/MessageModal";
import { LevelUpModal } from "@/app/components/modals/LevelUpModal";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import QuestionNavigationBar from "@/app/components/shared/navigation-bar/QuestionNavigationBar";
import NavigationBarWrapper from "@/app/components/shared/NavigationBarWrapper";

interface LevelUpModalState {
  visible: boolean;
  newLevel: number | null;
  xpGained: number | null;
}

const AttemptActivityPage = () => {
  const params = useParams<{ slug: string }>();
  const { user } = useGetCachedUser();
  const router = useRouter();

  const { data: activityData, isLoading: isActivityDataLoading } =
    useActivityWithQuestions(params.slug);

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
    text: "Are you sure you want to collect this activity? Please check again.",
  });

  const [messageModal, setMessageModal] = useState({
    visible: false,
    isSuccess: true,
    text: "",
    type: null as "submit" | "back" | null,
  });

  const [levelUpModal, setLevelUpModal] = useState<LevelUpModalState>({
    visible: false,
    newLevel: null,
    xpGained: null,
  });

  // Catat waktu attempt (startedAt & lastAccessedAt)
  useEffect(() => {
    const key = `activity_${params.slug}_startedAt`;
    const existingStart = sessionStorage.getItem(key);

    if (existingStart) {
      setStartedAt(new Date(existingStart));
      setLastAccessedAt(new Date(existingStart));
    } else {
      const now = new Date();
      sessionStorage.setItem(key, now.toISOString());
      setStartedAt(now);
      setLastAccessedAt(now);
    }
  }, [params.slug]);

  // Prefill answers ketika activityData berhasil dimuat
  useEffect(() => {
    if (!activityData) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya
    if (activityData.lastAttemptId) {
      const prefilledAnswers: Record<string, any> = {};

      activityData.questions.forEach((q) => {
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
  }, [activityData]);

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

  if (!activityData) return <Loading />;

  const handleOpenBackConfirmation = () => {
    setBackConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleBackConfirmation = async () => {
    if (!user || !activityData || !startedAt || !lastAccessedAt) return;

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
      const isNewAttempt = !activityData.lastAttemptId;
      const answerLogs = activityData.questions.map((q) => ({
        questionId: q.questionId,
        answerLogId: q.userAnswer?.answerLogId ?? undefined,
        optionId: answers[q.questionId]?.optionId || null,
        answerText: answers[q.questionId]?.answerText || null,
      }));

      let result = null;

      if (isNewAttempt) {
        // Simpan progres awal
        const payload: CreateTaskAttemptFormInputs = {
          answeredQuestionCount: answerLogs.filter(
            (a) => a.optionId || a.answerText
          ).length,
          status: TaskAttemptStatus.ON_PROGRESS,
          startedAt,
          lastAccessedAt,
          taskId: activityData.id,
          studentId: user.userId,
          answerLogs,
        };

        result = await taskAttemptProvider.createActivityAttempt(payload);
      } else {
        // Update progres yang sudah ada
        const payload: UpdateTaskAttemptFormInputs = {
          answeredQuestionCount: answerLogs.filter(
            (a) => a.optionId || a.answerText
          ).length,
          status: TaskAttemptStatus.ON_PROGRESS,
          lastAccessedAt,
          answerLogs: answerLogs
            .filter((a) => a.optionId || a.answerText)
            .map((a) => ({
              ...a,
              ...(a.answerLogId ? { answerLogId: a.answerLogId } : {}),
            })),
        };

        result = await taskAttemptProvider.updateActivityAttempt(
          activityData.lastAttemptId!,
          payload
        );
      }

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
    if (!user || !activityData || !startedAt || !lastAccessedAt) return;

    setSubmitConfirmationModal((prev) => ({ ...prev, visible: false }));

    const totalQuestions = activityData.questions.length;
    const answeredCount = Object.values(answers).filter(
      (a) => a.optionId || a.answerText
    ).length;

    // Prevent submit jika semua soal belum terjawab
    if (answeredCount < totalQuestions) {
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Please answer all questions to collect activities.",
        type: "submit",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isNewAttempt = !activityData.lastAttemptId;
      const answerLogs = activityData.questions.map((q) => ({
        questionId: q.questionId,
        answerLogId: q.userAnswer?.answerLogId ?? undefined,
        optionId: answers[q.questionId]?.optionId || null,
        answerText: answers[q.questionId]?.answerText || null,
      }));

      let result = null;

      if (isNewAttempt) {
        const payload: CreateTaskAttemptFormInputs = {
          answeredQuestionCount: answerLogs.filter(
            (a) => a.optionId || a.answerText
          ).length,
          status: TaskAttemptStatus.COMPLETED,
          startedAt,
          lastAccessedAt,
          taskId: activityData.id,
          studentId: user.userId,
          answerLogs,
        };

        result = await taskAttemptProvider.createActivityAttempt(payload);
      } else {
        const payload: UpdateTaskAttemptFormInputs = {
          answeredQuestionCount: answerLogs.filter(
            (a) => a.optionId || a.answerText
          ).length,
          status: TaskAttemptStatus.COMPLETED,
          lastAccessedAt,
          answerLogs: answerLogs
            .filter((a) => a.optionId || a.answerText)
            .map((a) => ({
              ...a,
              ...(a.answerLogId ? { answerLogId: a.answerLogId } : {}),
            })),
        };

        result = await taskAttemptProvider.updateActivityAttempt(
          activityData.lastAttemptId!,
          payload
        );
      }

      const data = result.data;

      if (data) {
        const { leveledUp, levelChangeSummary } = data;

        if (leveledUp && levelChangeSummary) {
          const { newLevel, previousXp, newXp } = levelChangeSummary;
          const xpGained = newXp - previousXp;

          setLevelUpModal({
            visible: true,
            newLevel: newLevel ?? null,
            xpGained: xpGained,
          });

          return;
        }
      }

      setMessageModal({
        visible: true,
        isSuccess: result?.isSuccess ?? false,
        text: result?.isSuccess
          ? "Activities have been successfully collected."
          : "Activity Failed to be Collected.",
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
      router.push(`${ROUTES.ROOT.ACTIVITYSUMMARY}/${params.slug}`);
    } else if (messageModal.type === "back") {
      router.back();
    }
  };

  const handleLevelUpModalConfirmation = () => {
    setLevelUpModal((prev) => ({ ...prev, visible: false }));
    router.push(`${ROUTES.ROOT.ACTIVITYSUMMARY}/${params.slug}`);
  };

  const currentQuestion = activityData.questions[selectedQuestionIndex];

  return (
    <>
      {(isActivityDataLoading || isLoading) && <Loading />}

      <PageLayout>
        {/* Navigation Atas */}
        <NavigationBarWrapper
          onBack={handleOpenBackConfirmation}
          onNext={handleOpenSubmitConfirmation}
        />

        {/* Navigasi Soal */}
        <QuestionNavigationBar
          questions={activityData.questions}
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

        <LevelUpModal
          visible={levelUpModal.visible}
          newLevel={levelUpModal.newLevel}
          xpGained={levelUpModal.xpGained}
          onConfirm={handleLevelUpModalConfirmation}
        />
      </PageLayout>
    </>
  );
};

export default AttemptActivityPage;
