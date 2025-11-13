"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { IMAGES } from "@/app/constants/images";
import { DetailInformationTable } from "@/app/components/shared/table/detail-page/TableTemplate";
import {
  DateRow,
  NumberRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import { TaskSummaryQuestionCard } from "@/app/components/shared/cards";
import { useClassTaskSummary } from "@/app/hooks/class-tasks/useClassTaskSummary";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { ROUTES } from "@/app/constants/routes";

export const dynamic = "force-dynamic";

const StudentTaskSummaryPageContent = () => {
  const searchParams = useSearchParams();
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

  const {
    data: classTaskSummaryData,
    isLoading: isClassTaskSummaryDataLoading,
  } = useClassTaskSummary(classSlug, taskSlug);

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
    const { title, image, description } = classTaskSummaryData;

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
    const { point, xpGained, completedAt } = classTaskSummaryData;

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
          {classTaskSummaryData.questions.map((q, idx) => (
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
    <>
      {isClassTaskSummaryDataLoading && <Loading />}

      <DashboardTitle
        title="Ringkasan Pengumpulan Tugas"
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
  )
}
