"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActivitySummary } from "@/app/hooks/activities/useActivitySummary";
import Loading from "@/app/components/shared/Loading";
import PageLayout from "@/app/(root)/page-layout";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { IMAGES } from "@/app/constants/images";
import { DetailInformationTable } from "@/app/components/shared/table/detail-page/TableTemplate";
import {
  DateRow,
  NumberRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import ActivityQuestionCard from "@/app/components/pages/Activity/Summary/ActivityQuestionCard";

const ActivitySummaryPage = () => {
  const params = useParams<{ slug: string }>();

  const { data: activitySummaryData, isLoading: isActivitySummaryDataLoading } =
    useActivitySummary(params.slug);

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
    const { point, xpGained, completedAt } = activitySummaryData;

    return (
      <>
        {/* Informasi Detail */}
        <DetailInformationTable>
          <NumberRow label="Jumlah Poin" value={point} />
          <NumberRow label="Jumlah XP" value={xpGained} />
          <DateRow label="Selesai Dikerjakan" value={completedAt} />
        </DetailInformationTable>
      </>
    );
  };

  const BottomContent = () => {
    return (
      <div className="w-full mx-0 md:max-w-[70%] lg:max-w-[60%] md:mx-auto">
        <h2 className="text-dark font-semibold text-2xl mb-4">Daftar Soal</h2>

        <div className="flex flex-col gap-8">
          {activitySummaryData.questions.map((q, idx) => (
            <ActivityQuestionCard
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
    <>
      {(isActivitySummaryDataLoading) && <Loading />}

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
