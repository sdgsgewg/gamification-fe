"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Loading from "@/app/components/shared/Loading";
import { ROUTES } from "@/app/constants/routes";

import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { useClassTaskWithQuestions } from "@/app/hooks/class-tasks/useClassTaskWithQuestions";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { useAttemptSession } from "@/app/hooks/task-attempt/useAttemptSession";
import { useAttemptAnswers } from "@/app/hooks/task-attempt/useAttemptAnswers";
import { useAttemptPrefill } from "@/app/hooks/task-attempt/useAttemptPrefill";
import { useAttemptActions } from "@/app/hooks/task-attempt/useAttemptActions";
import { AttemptNavigation } from "@/app/components/shared/attempt/AttemptNavigation";
import { AttemptQuestionView } from "@/app/components/shared/attempt/AttemptQuestionView";
import { AttemptModals } from "@/app/components/shared/attempt/AttemptModals";
import { LevelUpModal } from "@/app/components/modals/LevelUpModal";

const StudentAttemptClassTaskPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { user } = useGetCachedUser();

  const classSlug = searchParams.get("class") ?? "";
  const taskSlug = searchParams.get("task") ?? "";

  /* =========================
   * DATA
   * ========================= */
  const { data: classTaskData, isLoading: isClassTaskLoading } =
    useClassTaskWithQuestions(classSlug, taskSlug);

  const { data: classData, isLoading: isClassLoading } = useClassDetail(
    classSlug,
    "detail",
  );

  /* =========================
   * SESSION & ANSWERS
   * ========================= */
  const storageKey = `class_task_${taskSlug}_startedAt`;
  const { startedAt, lastAccessedAt, clearSession } =
    useAttemptSession(storageKey);

  const {
    answers,
    setAnswers,
    selectOption,
    changeText,
    answeredCount,
    hasAnsweredAtLeastOne,
  } = useAttemptAnswers();

  useAttemptPrefill(classTaskData, setAnswers);

  /* =========================
   * ACTIONS
   * ========================= */
  const { saveProgress, submitAttempt } = useAttemptActions({
    data: classTaskData!,
    userId: user ? user?.userId : "",
    answers,
    startedAt: startedAt!,
    lastAccessedAt: lastAccessedAt!,
    createAttempt: taskAttemptProvider.createClassTaskAttempt,
    updateAttempt: taskAttemptProvider.updateClassTaskAttempt,
  });

  /* =========================
   * UI STATE
   * ========================= */
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [backModal, setBackModal] = useState({
    visible: false,
    text: "Are you sure you want to go back? All progress will be saved.",
  });

  const [submitModal, setSubmitModal] = useState({
    visible: false,
    text: "Are you sure you want to submit this task? Please check again.",
  });

  const [messageModal, setMessageModal] = useState({
    visible: false,
    isSuccess: true,
    text: "",
    type: null as "submit" | "back" | null,
  });

  const [levelUpModal, setLevelUpModal] = useState({
    visible: false,
    newLevel: null as number | null,
    xpGained: null as number | null,
  });

  /* =========================
   * HANDLERS
   * ========================= */
  const handleBackConfirm = async () => {
    setBackModal((p) => ({ ...p, visible: false }));

    if (!hasAnsweredAtLeastOne) {
      clearSession();
      router.back();
      return;
    }

    const result = await saveProgress();

    if (result?.isSuccess) {
      clearSession();
    }

    setMessageModal({
      visible: true,
      isSuccess: result?.isSuccess ?? false,
      text: result?.isSuccess
        ? "Progress successfully saved."
        : "Failed to save progress.",
      type: "back",
    });
  };

  const handleSubmitConfirm = async () => {
    setSubmitModal((p) => ({ ...p, visible: false }));

    if (classTaskData && answeredCount < classTaskData.questions.length) {
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Please answer all questions to complete the task.",
        type: "submit",
      });
      return;
    }

    const result = await submitAttempt();

    if (result?.isSuccess) {
      clearSession();
    }

    if (result?.data?.leveledUp && result.data.levelChangeSummary) {
      const { newLevel, previousXp, newXp } = result.data.levelChangeSummary;

      setLevelUpModal({
        visible: true,
        newLevel,
        xpGained: newXp - previousXp,
      });
      return;
    }

    setMessageModal({
      visible: true,
      isSuccess: result?.isSuccess ?? false,
      text: result?.isSuccess
        ? "The task has been successfully submitted."
        : "Task submission failed.",
      type: "submit",
    });
  };

  const handleMessageConfirm = () => {
    setMessageModal((p) => ({ ...p, visible: false }));

    if (!messageModal.isSuccess) return;

    if (messageModal.type === "submit" && classTaskData) {
      router.push(
        `${ROUTES.DASHBOARD.STUDENT.TASKS}/attempts/${classTaskData.lastAttemptId}/summary`,
      );
    } else {
      router.back();
    }
  };

  const handleLevelUpConfirm = () => {
    if (!classTaskData) return;

    clearSession();
    setLevelUpModal((p) => ({ ...p, visible: false }));

    router.push(
      `${ROUTES.DASHBOARD.STUDENT.TASKS}/attempts/${classTaskData.lastAttemptId}/summary`,
    );
  };

  /* =========================
   * LOADING
   * ========================= */
  if (isClassTaskLoading || isClassLoading || !classTaskData || !classData) {
    return <Loading />;
  }

  /* =========================
   * RENDER
   * ========================= */
  return (
    <>
      <AttemptNavigation
        onBack={() => setBackModal((p) => ({ ...p, visible: true }))}
        onSubmit={() => setSubmitModal((p) => ({ ...p, visible: true }))}
      />

      <AttemptQuestionView
        questions={classTaskData.questions}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        answers={answers}
        onSelectOption={selectOption}
        onChangeText={changeText}
        scrollRef={scrollRef}
      />

      <AttemptModals
        back={backModal}
        submit={submitModal}
        message={messageModal}
        setBack={setBackModal}
        setSubmit={setSubmitModal}
        onBackConfirm={handleBackConfirm}
        onSubmitConfirm={handleSubmitConfirm}
        onMessageConfirm={handleMessageConfirm}
      />

      <LevelUpModal
        visible={levelUpModal.visible}
        newLevel={levelUpModal.newLevel}
        xpGained={levelUpModal.xpGained}
        onConfirm={handleLevelUpConfirm}
      />
    </>
  );
};

export default function StudentAttemptClassTaskPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StudentAttemptClassTaskPageContent />
    </Suspense>
  );
}
