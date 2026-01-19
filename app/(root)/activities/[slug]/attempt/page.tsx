"use client";

import { Suspense, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Loading from "@/app/components/shared/Loading";
import PageLayout from "@/app/(root)/page-layout";
import { ROUTES } from "@/app/constants/routes";

import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { useActivityWithQuestions } from "@/app/hooks/activities/useActivityWithQuestions";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";

import { LevelUpModal } from "@/app/components/modals/LevelUpModal";
import { useAttemptSession } from "@/app/hooks/task-attempt/useAttemptSession";
import { useAttemptAnswers } from "@/app/hooks/task-attempt/useAttemptAnswers";
import { useAttemptPrefill } from "@/app/hooks/task-attempt/useAttemptPrefill";
import { useAttemptActions } from "@/app/hooks/task-attempt/useAttemptActions";
import { AttemptNavigation } from "@/app/components/shared/attempt/AttemptNavigation";
import { AttemptQuestionView } from "@/app/components/shared/attempt/AttemptQuestionView";
import { AttemptModals } from "@/app/components/shared/attempt/AttemptModals";

const AttemptActivityPageContent = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { user } = useGetCachedUser();

  /* =========================
   * DATA
   * ========================= */
  const { data: activityData, isLoading } = useActivityWithQuestions(slug);

  /* =========================
   * SESSION & ANSWERS
   * ========================= */
  const storageKey = `activity_${slug}_startedAt`;
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

  useAttemptPrefill(activityData, setAnswers);

  /* =========================
   * ACTIONS
   * ========================= */
  const { saveProgress, submitAttempt, lastSubmitResult } = useAttemptActions({
    data: activityData!,
    userId: user ? user.userId : "",
    answers,
    startedAt: startedAt!,
    lastAccessedAt: lastAccessedAt!,
    createAttempt: taskAttemptProvider.createActivityAttempt,
    updateAttempt: taskAttemptProvider.updateActivityAttempt,
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
    text: "Are you sure you want to submit this activity? Please check again.",
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

    if (activityData && answeredCount < activityData.questions.length) {
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Please answer all questions to submit activity.",
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
        ? "Activity successfully submitted."
        : "Activity submission failed.",
      type: "submit",
    });
  };

  const handleMessageConfirm = () => {
    setMessageModal((p) => ({ ...p, visible: false }));

    if (!messageModal.isSuccess) return;

    if (messageModal.type === "submit" && activityData) {
      router.push(
        `${ROUTES.ROOT.ACTIVITY}/attempts/${activityData.lastAttemptId}/summary`,
      );
    } else {
      router.back();
    }
  };

  const handleLevelUpConfirm = () => {
    if (!activityData) return;

    clearSession();
    setLevelUpModal((p) => ({ ...p, visible: false }));
    
    router.push(
      `${ROUTES.ROOT.ACTIVITY}/attempts/${activityData.lastAttemptId}/summary`,
    );
  };

  /* =========================
   * LOADING
   * ========================= */
  if (isLoading || !activityData) return <Loading />;

  /* =========================
   * RENDER
   * ========================= */
  return (
    <PageLayout>
      <AttemptNavigation
        onBack={() => setBackModal((p) => ({ ...p, visible: true }))}
        onSubmit={() => setSubmitModal((p) => ({ ...p, visible: true }))}
      />

      <AttemptQuestionView
        questions={activityData.questions}
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
    </PageLayout>
  );
};

export default function AttemptActivityPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AttemptActivityPageContent />
    </Suspense>
  );
}
