"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { IMAGES } from "@/app/constants/images";
import {
  DetailInformationTable,
  ProgressTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { NumberRow } from "@/app/components/shared/table/detail-page/TableRowData";
import { TaskSummaryQuestionCard } from "@/app/components/shared/cards";
import { useClassTaskSummary } from "@/app/hooks/class-tasks/useClassTaskSummary";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { ROUTES } from "@/app/constants/routes";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";
import TaskDetailPageBottomContentWrapper from "@/app/components/shared/detail-page/TaskDetailPageBottomContentWrapper";

const StudentTaskSummaryPageContent = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: classTaskSummaryData,
    isLoading: isClassTaskSummaryDataLoading,
  } = useClassTaskSummary(params.id);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Prefill answers ketika classTaskSummaryData berhasil dimuat
  useEffect(() => {
    if (!classTaskSummaryData) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya

    const prefilledAnswers: Record<string, any> = {};

    classTaskSummaryData.questions.forEach((q) => {
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
  }, [classTaskSummaryData]);

  if (!classTaskSummaryData) return <Loading />;

  const handleBack = () => {
    router.push(ROUTES.DASHBOARD.STUDENT.TASKS);
  };

  const LeftSideContent = () => {
    const {
      title,
      image,
      description,
      teacherName,
      className,
      gradingProgress,
    } = classTaskSummaryData;

    const additionalText = gradingProgress
      ? `Graded by ${teacherName} from class '${className}'`
      : `Graded by SYSTEM from class '${className}'`;

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          additionalText={additionalText}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />
      </>
    );
  };

  const RightSideContent = () => {
    const { pointGained, totalPoints, score, xpGained } =
      classTaskSummaryData.stats;

    return (
      <>
        {/* Stats */}
        <DetailInformationTable>
          <NumberRow
            label="Point Gained"
            value={pointGained ? `${pointGained}/${totalPoints}` : "-"}
          />
          <NumberRow label="Score" value={score} />
          <NumberRow label="XP Gained" value={xpGained} />
        </DetailInformationTable>
      </>
    );
  };

  const BottomContent = () => {
    const [view, setView] = useState<TaskDetailBottomContentView>("progress");

    const { attemptProgress, gradingProgress, questions } =
      classTaskSummaryData;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      { key: "progress" as const, label: "Progress" },
      { key: "questions" as const, label: "Questions" },
    ];

    const handleChangeTab = (key: TaskDetailBottomContentView) => {
      setView(key);
    };

    const ProgressView = () => {
      const {
        startedAt,
        completedAt,
        submittedAt,
        duration: attemptDuration,
        status: attemptStatus,
      } = attemptProgress;

      return (
        <div className="flex flex-col gap-6">
          {/* Attempt Progress */}
          <ProgressTable
            startedAt={startedAt}
            completedAt={completedAt}
            submittedAt={submittedAt}
            duration={attemptDuration}
            status={attemptStatus}
          />

          {/* Grading Progress */}
          {gradingProgress && (
            <ProgressTable
              title="Grading Progress"
              startedAt={gradingProgress.startGradedAt}
              submittedAt={gradingProgress.finishGradedAt}
              duration={gradingProgress.duration}
              status={gradingProgress.status}
            />
          )}
        </div>
      );
    };

    const QuestionView = () => {
      return (
        <div className="w-full mx-0 md:max-w-[70%] lg:max-w-[60%] md:mx-auto">
          <h2 className="text-dark font-semibold text-2xl mb-4">Questions</h2>

          <div className="flex flex-col gap-8">
            {questions.map((q, idx) => (
              <TaskSummaryQuestionCard
                key={idx}
                index={idx}
                question={q}
                selectedOptionId={answers[q.questionId]?.optionId}
                answerText={answers[q.questionId]?.answerText}
              />
            ))}
          </div>
        </div>
      );
    };

    return (
      <TaskDetailPageBottomContentWrapper
        tabs={tabs}
        view={view}
        onChangeTab={handleChangeTab}
      >
        {view === "progress" ? <ProgressView /> : <QuestionView />}
      </TaskDetailPageBottomContentWrapper>
    );
  };

  return (
    <>
      {isClassTaskSummaryDataLoading && <Loading />}

      <DashboardTitle
        title="Task Submission Summary"
        showBackButton={true}
        onBack={handleBack}
      />

      <DetailPageWrapper
        left={<LeftSideContent />}
        right={<RightSideContent />}
        bottom={<BottomContent />}
      />
    </>
  );
};

export default function StudentTaskSummaryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StudentTaskSummaryPageContent />
    </Suspense>
  );
}
