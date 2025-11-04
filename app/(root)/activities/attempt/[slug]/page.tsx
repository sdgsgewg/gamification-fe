"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActivityWithQuestions } from "@/app/hooks/activities/useActivityWithQuestions";
import ActivityQuestionNavigationBar from "@/app/components/pages/Activity/Attempt/ActivityQuestionNavigationBar";
import AttemptQuestionCard from "@/app/components/pages/Activity/Attempt/ActivityQuestionCard";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { CreateTaskAttemptFormInputs } from "@/app/schemas/task-attempts/createTaskAttempt";
import { UpdateTaskAttemptFormInputs } from "@/app/schemas/task-attempts/updateTaskAttempt";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import Loading from "@/app/components/shared/Loading";
import PageLayout from "@/app/(root)/page-layout";
import AttemptActivityNavigationBarWrapper from "@/app/components/pages/Activity/Attempt/AttemptActivityNavigationBarWrapper";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { MessageModal } from "@/app/components/modals/MessageModal";
import { LevelUpModal } from "@/app/components/modals/LevelUpModal";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "Apakah anda yakin ingin kembali? Semua progres akan tetap disimpan.",
  });

  const [submitConfirmationModal, setSubmitConfirmationModal] = useState({
    visible: false,
    text: "Apakah anda yakin ingin mengumpulkan aktivitas ini? Mohon dikoreksi kembali.",
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
    if (!user || !activityData) return;

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
          taskId: activityData.id,
          studentId: user.userId,
          answerLogs,
        };

        console.log(
          "Payload (Autosave - Create): ",
          JSON.stringify(payload, null, 2)
        );
        result = await taskAttemptProvider.createTaskAttempt(payload);
      } else {
        // Update progres yang sudah ada
        const payload: UpdateTaskAttemptFormInputs = {
          answeredQuestionCount: answerLogs.filter(
            (a) => a.optionId || a.answerText
          ).length,
          answerLogs: answerLogs
            .filter((a) => a.optionId || a.answerText)
            .map((a) => ({
              ...a,
              ...(a.answerLogId ? { answerLogId: a.answerLogId } : {}),
            })),
        };

        console.log(
          "Payload (Autosave - Update): ",
          JSON.stringify(payload, null, 2)
        );
        result = await taskAttemptProvider.updateTaskAttempt(
          activityData.lastAttemptId!,
          payload
        );
      }

      setMessageModal({
        visible: true,
        isSuccess: result?.isSuccess ?? false,
        text: result?.isSuccess
          ? "Progres berhasil disimpan."
          : "Gagal menyimpan progres.",
        type: "back",
      });
    } catch (err) {
      console.error("Error saat autosave sebelum kembali:", err);
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Terjadi kesalahan saat menyimpan progres.",
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
    if (!user || !activityData) return;

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
        text: "Mohon jawab semua soal untuk dapat mengumpulkan aktivitas.",
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
          taskId: activityData.id,
          studentId: user.userId,
          answerLogs,
        };

        console.log("Payload (Create): ", JSON.stringify(payload, null, 2));

        result = await taskAttemptProvider.createTaskAttempt(payload);
      } else {
        const payload: UpdateTaskAttemptFormInputs = {
          answeredQuestionCount: answerLogs.filter(
            (a) => a.optionId || a.answerText
          ).length,
          answerLogs: answerLogs
            .filter((a) => a.optionId || a.answerText)
            .map((a) => ({
              ...a,
              ...(a.answerLogId ? { answerLogId: a.answerLogId } : {}),
            })),
        };

        console.log("Payload (Update): ", JSON.stringify(payload, null, 2));

        result = await taskAttemptProvider.updateTaskAttempt(
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
          ? "Aktivitas Telah Berhasil Dikumpulkan"
          : "Aktivitas Gagal Dikumpulkan",
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
        <AttemptActivityNavigationBarWrapper
          onBack={handleOpenBackConfirmation}
          onNext={handleOpenSubmitConfirmation}
        />

        {/* Navigasi Soal */}
        <ActivityQuestionNavigationBar
          questions={activityData.questions}
          selectedQuestionIndex={selectedQuestionIndex}
          setSelectedQuestionIndex={setSelectedQuestionIndex}
          answers={answers}
          scrollContainerRef={scrollContainerRef}
        />

        {/* Tampilan Soal */}
        <AttemptQuestionCard
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
