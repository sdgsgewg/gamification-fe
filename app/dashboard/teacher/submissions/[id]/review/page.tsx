"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import Loading from "@/app/components/shared/Loading";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { MessageModal } from "@/app/components/modals/MessageModal";
import { useTaskSubmissionWithAnswers } from "@/app/hooks/task-submissions/useTaskSubmissionWithAnswers";
import { UpdateTaskSubmissionFormInputs } from "@/app/schemas/task-submissions/updateTaskSubmission";
import { TaskSubmissionStatus } from "@/app/enums/TaskSubmissionStatus";
import { taskSubmissionProvider } from "@/app/functions/TaskSubmissionProvider";
import NavigationBarWrapper from "@/app/components/shared/NavigationBarWrapper";
import QuestionNavigationBar from "@/app/components/shared/navigation-bar/QuestionNavigationBar";
import { ReviewTaskQuestionCard } from "@/app/components/pages/Dashboard/Submission/Cards";
import { SubmitWithFeedbackModal } from "@/app/components/modals/SubmitWithFeedbackModal";

const ReviewSubmissionPage = () => {
  const params = useParams<{ id: string }>();
  const { user } = useGetCachedUser();
  const router = useRouter();

  const { data: submissionData, isLoading: isSubmissionDataLoading } =
    useTaskSubmissionWithAnswers(params.id);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<
      string,
      {
        answerLogId: string;
        isCorrect?: boolean;
        pointAwarded?: number | null;
        teacherNotes?: string | null;
      }
    >
  >({});

  const [startGradedAt, setStartGradedAt] = useState<Date | null>(null);
  const [lastGradedAt, setLastGradedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "Are you sure you want to go back? All progress will be saved.",
  });

  const [submitFeedbackModal, setSubmitFeedbackModal] = useState({
    visible: false,
    text: "Are you sure you want to submit? Add feedback below.",
  });

  const [messageModal, setMessageModal] = useState({
    visible: false,
    isSuccess: true,
    text: "",
    type: null as "submit" | "back" | null,
  });

  // Inisialisasi waktu mulai review
  useEffect(() => {
    const key = `submission_${params.id}_startGradedAt`;
    const existingStart = sessionStorage.getItem(key);
    const now = new Date();

    if (existingStart) {
      setStartGradedAt(new Date(existingStart));
    } else {
      sessionStorage.setItem(key, now.toISOString());
      setStartGradedAt(now);
    }
    setLastGradedAt(now);
  }, [params.id]);

  //  Prefill jawaban + hasil koreksi sebelumnya (jika ada)
  useEffect(() => {
    if (!submissionData) return;

    const prefilledAnswers: Record<string, any> = {};

    submissionData.questions.forEach((q) => {
      prefilledAnswers[q.questionId] = {
        answerLogId: q.userAnswer?.answerLogId,
        isCorrect: q.userAnswer?.isCorrect ?? null,
        pointAwarded: q.userAnswer?.pointAwarded ?? null,
        teacherNotes: q.userAnswer?.teacherNotes ?? "",
      };
    });

    setAnswers(prefilledAnswers);
  }, [submissionData]);

  // Event handlers untuk update state lokal
  const handleCorrectChange = (questionId: string, isCorrect: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isCorrect },
    }));
  };

  const handlePointChange = (questionId: string, point: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], pointAwarded: point },
    }));
  };

  const handleTeacherNotesChange = (questionId: string, notes: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], teacherNotes: notes },
    }));
  };

  const isAllQuestionsReviewed = () => {
    if (!submissionData) return false;

    return submissionData.questions.every((q) => {
      const ans = answers[q.questionId];
      return (
        ans?.isCorrect !== null &&
        ans?.isCorrect !== undefined &&
        ans?.pointAwarded !== null &&
        ans?.pointAwarded !== undefined
      );
    });
  };

  const handleOpenBackConfirmation = () => {
    setBackConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleBackConfirmation = async () => {
    if (!user || !submissionData || !startGradedAt || !lastGradedAt) return;

    setBackConfirmationModal((prev) => ({ ...prev, visible: false }));

    setIsLoading(true);

    try {
      const reviewLogs = submissionData.questions.map((q) => ({
        answerLogId: answers[q.questionId].answerLogId,
        isCorrect: answers[q.questionId]?.isCorrect ?? null,
        pointAwarded: answers[q.questionId]?.pointAwarded ?? null,
        teacherNotes: answers[q.questionId]?.teacherNotes ?? null,
      }));

      // Update progres yang sudah ada
      const payload: UpdateTaskSubmissionFormInputs = {
        status: TaskSubmissionStatus.ON_PROGRESS,
        startGradedAt,
        lastGradedAt,
        answers: reviewLogs,
      };

      console.log("Payload: ", JSON.stringify(payload, null, 2));

      const result = await taskSubmissionProvider.updateTaskSubmission(
        params.id,
        payload
      );

      const { isSuccess, message } = result;

      setMessageModal({
        visible: true,
        isSuccess: isSuccess ?? false,
        text:
          isSuccess && message
            ? message || "Progress has been saved successfully."
            : "Failed to save progress.",
        type: "back",
      });
    } catch (err) {
      console.error("Error during autosave before going back: ", err);
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
    if (!isAllQuestionsReviewed()) {
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Please review all questions before submitting.",
        type: null,
      });
      return;
    }

    setSubmitFeedbackModal((prev) => ({ ...prev, visible: true }));
  };

  const handleSubmitWithFeedback = async (feedback: string | null) => {
    if (!user || !submissionData || !startGradedAt || !lastGradedAt) return;

    setSubmitFeedbackModal((prev) => ({ ...prev, visible: false }));

    if (!isAllQuestionsReviewed()) {
      setMessageModal({
        visible: true,
        isSuccess: false,
        text: "Please complete the review for all questions first.",
        type: null,
      });
      return;
    }

    setIsLoading(true);

    try {
      const reviewLogs = submissionData.questions.map((q) => ({
        answerLogId: answers[q.questionId]?.answerLogId,
        isCorrect: answers[q.questionId]?.isCorrect ?? null,
        pointAwarded: answers[q.questionId]?.pointAwarded ?? null,
        teacherNotes: answers[q.questionId]?.teacherNotes ?? null,
      }));

      const payload: UpdateTaskSubmissionFormInputs = {
        status: TaskSubmissionStatus.COMPLETED,
        lastGradedAt,
        feedback,
        answers: reviewLogs,
      };

      const result = await taskSubmissionProvider.updateTaskSubmission(
        params.id,
        payload
      );

      const { isSuccess, message } = result;

      setMessageModal({
        visible: true,
        isSuccess: isSuccess ?? false,
        text:
          isSuccess && message
            ? message || "Submission has been saved."
            : "Failed to save submission.",
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
      router.push(`${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}/${params.id}`);
    } else if (messageModal.type === "back") {
      router.back();
    }
  };

  if (isSubmissionDataLoading || !submissionData) return <Loading />;

  const currentQuestion = submissionData.questions[selectedQuestionIndex];

  return (
    <>
      {isLoading && <Loading />}

      {/* Navigation Atas */}
      <NavigationBarWrapper
        onBack={handleOpenBackConfirmation}
        onNext={handleOpenSubmitConfirmation}
      />

      {/* Navigasi Soal */}
      <QuestionNavigationBar
        questions={submissionData.questions}
        selectedQuestionIndex={selectedQuestionIndex}
        setSelectedQuestionIndex={setSelectedQuestionIndex}
        answers={answers}
        scrollContainerRef={scrollContainerRef}
      />

      {/* Tampilan Soal */}
      <ReviewTaskQuestionCard
        index={selectedQuestionIndex}
        question={currentQuestion}
        answerLog={answers[currentQuestion.questionId]}
        onCorrectChange={(isCorrect) =>
          handleCorrectChange(currentQuestion.questionId, isCorrect)
        }
        onPointChange={(point) =>
          handlePointChange(currentQuestion.questionId, point)
        }
        onTeacherNotesChange={(notes) =>
          handleTeacherNotesChange(currentQuestion.questionId, notes)
        }
      />

      {/* Modals */}
      {/* Back Confirmation Modal */}
      <ConfirmationModal
        visible={backConfirmationModal.visible}
        text={backConfirmationModal.text}
        type="back"
        onConfirm={handleBackConfirmation}
        onCancel={() =>
          setBackConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />

      {/* Submit Confirmation Modal */}
      <SubmitWithFeedbackModal
        visible={submitFeedbackModal.visible}
        text={submitFeedbackModal.text}
        onSubmit={handleSubmitWithFeedback}
        onCancel={() =>
          setSubmitFeedbackModal((prev) => ({ ...prev, visible: false }))
        }
      />

      {/* Message Modal */}
      <MessageModal
        visible={messageModal.visible}
        isSuccess={messageModal.isSuccess}
        text={messageModal.text}
        onConfirm={handleMessageModalConfirmation}
      />
    </>
  );
};

export default ReviewSubmissionPage;
