"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActivitySummary } from "@/app/hooks/activities/useActivitySummary";
import Loading from "@/app/components/shared/Loading";
import PageLayout from "@/app/(root)/page-layout";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { IMAGES } from "@/app/constants/images";
import {
  DetailInformationTable,
  ProgressTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { NumberRow } from "@/app/components/shared/table/detail-page/TableRowData";
import { TaskSummaryQuestionCard } from "@/app/components/shared/cards";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";
import TaskDetailPageBottomContentWrapper from "@/app/components/shared/detail-page/TaskDetailPageBottomContentWrapper";

const ActivitySummaryPage = () => {
  const params = useParams<{ id: string }>();

  const { data: activitySummaryData, isLoading: isActivitySummaryDataLoading } =
    useActivitySummary(params.id);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Prefill answers ketika activitySummaryData berhasil dimuat
  useEffect(() => {
    if (!activitySummaryData) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya

    const prefilledAnswers: Record<string, any> = {};

    activitySummaryData.questions.forEach((q) => {
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
  }, [activitySummaryData]);

  if (!activitySummaryData) return <Loading />;

  const LeftSideContent = () => {
    const { title, image, description } = activitySummaryData;

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />
      </>
    );
  };

  const RightSideContent = () => {
    const { pointGained, totalPoints, score, xpGained } =
      activitySummaryData.stats;

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

    const { progress, questions } = activitySummaryData;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      { key: "progress" as const, label: "Progress" },
      { key: "questions" as const, label: "Questions" },
    ];

    const handleChangeTab = (key: TaskDetailBottomContentView) => {
      setView(key);
    };

    const ProgressView = () => {
      const { startedAt, completedAt, duration, status } = progress;

      return (
        <ProgressTable
          startedAt={startedAt}
          completedAt={completedAt}
          duration={duration}
          status={status}
        />
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
      {isActivitySummaryDataLoading && <Loading />}

      <PageLayout>
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
        />
      </PageLayout>
    </>
  );
};

export default ActivitySummaryPage;
