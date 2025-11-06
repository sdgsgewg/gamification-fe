"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTaskAttemptDetail } from "@/app/hooks/task-attempts/useTaskAttemptDetail";
import Loading from "@/app/components/shared/Loading";
import PageLayout from "@/app/(root)/page-layout";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { IMAGES } from "@/app/constants/images";
import {
  DetailInformationTable,
  DurationTable,
  ProgressTable,
  TaskDetailInformationTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { NumberRow } from "@/app/components/shared/table/detail-page/TableRowData";
import ActivityQuestionCard from "@/app/components/pages/Activity/Summary/ActivityQuestionCard";
import { getDateTime } from "@/app/utils/date";

import Button from "@/app/components/shared/Button";
import StatusBar from "@/app/components/shared/StatusBar";
import { ROUTES } from "@/app/constants/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";

type BottomContentView = "stats" | "duration" | "progress" | "questions";

const HistoryDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: attemptDetailData, isLoading: isattemptDetailDataLoading } =
    useTaskAttemptDetail(params.id);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Prefill answers ketika attemptDetailData berhasil dimuat
  useEffect(() => {
    if (!attemptDetailData) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya

    const prefilledAnswers: Record<string, any> = {};

    attemptDetailData.questions.forEach((q) => {
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
  }, [attemptDetailData]);

  const handleNavigateToActivityAttemptPage = () => {
    router.push(`${ROUTES.ROOT.ACTIVITYATTEMPT}/${attemptDetailData?.slug}`);
  };

  if (!attemptDetailData) return <Loading />;

  const LeftSideContent = () => {
    const {
      title,
      image,
      description,
      questionCount,
      type,
      attempt,
      progress,
    } = attemptDetailData;

    const answeredCount = attempt?.answeredCount ?? 0;
    const lastAccessedAt = progress?.lastAccessedAt ?? null;
    const status = progress.status;

    const buttonText =
      status === TaskAttemptStatus.ON_PROGRESS
        ? "Lanjutkan"
        : type.isRepeatable
        ? "Kerja Ulang"
        : "Mulai";

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />

        {/* Status Pengerjaan (untuk section "Lanjut Mengerjakan") */}
        {lastAccessedAt && answeredCount && answeredCount < questionCount && (
          <StatusBar
            current={answeredCount}
            total={questionCount}
            labelClassName="text-base font-medium"
            bgClassName="bg-white"
            height={"h-6"}
          />
        )}

        <Button
          type="primary"
          size="large"
          variant="primary"
          className="!py-4 !px-6 !rounded-[1.5rem]"
          onClick={handleNavigateToActivityAttemptPage}
        >
          <FontAwesomeIcon icon={faPlay} />
          <span className="text-base font-semibold ms-3">{buttonText}</span>
        </Button>
      </>
    );
  };

  const RightSideContent = () => {
    const { subject, material, type, questionCount, difficulty, grade } =
      attemptDetailData;

    return (
      <TaskDetailInformationTable
        subject={subject}
        material={material}
        type={type.name}
        questionCount={questionCount}
        difficulty={difficulty}
        grade={grade}
      />
    );
  };

  const BottomContent = () => {
    const [view, setView] = useState<BottomContentView>("stats");

    const { duration, progress } = attemptDetailData;
    const isCompleted = !!progress?.completedAt; // true kalau sudah selesai

    // Buat daftar tab dinamis
    const tabs: { key: BottomContentView; label: string }[] = [
      ...(isCompleted ? [{ key: "stats" as const, label: "Statistik" }] : []),
      { key: "duration" as const, label: "Durasi" },
      { key: "progress" as const, label: "Progres" },
      ...(isCompleted
        ? [{ key: "questions" as const, label: "Daftar Soal" }]
        : []),
    ];

    // Jika view aktif tidak tersedia lagi (misal user di stats tapi belum completed), fallback ke "progress"
    useEffect(() => {
      if (!isCompleted && (view === "stats" || view === "questions")) {
        setView("progress");
      }
    }, [isCompleted, view]);

    const StatsView = () => {
      const { pointGained, totalPoints, xpGained, score } =
        attemptDetailData.stats;

      return (
        <DetailInformationTable>
          <NumberRow
            label="Jumlah Poin"
            value={pointGained ? `${pointGained}/${totalPoints}` : "-"}
          />
          <NumberRow label="Jumlah XP" value={xpGained} />
          <NumberRow label="Nilai" value={pointGained ? score : "-"} />
        </DetailInformationTable>
      );
    };

    const DurationView = () => {
      if (!duration) return;

      const { startTime, endTime, duration: taskDuration } = duration;

      return (
        <DurationTable
          startTime={getDateTime(startTime ?? null)}
          endTime={getDateTime(endTime ?? null)}
          duration={taskDuration}
        />
      );
    };

    const ProgressView = () => {
      const { startedAt, lastAccessedAt, completedAt, status } =
        attemptDetailData.progress;

      const statusLabel =
        TaskAttemptStatusLabels[status as TaskAttemptStatus] ?? "";

      return (
        <ProgressTable
          startedAt={startedAt}
          lastAccessedAt={lastAccessedAt}
          completedAt={completedAt}
          status={statusLabel}
        />
      );
    };

    const QuestionView = () => {
      return (
        <>
          <h2 className="text-dark font-semibold text-2xl mb-4">Daftar Soal</h2>

          <div className="flex flex-col gap-8">
            {attemptDetailData.questions.map((q, idx) => (
              <ActivityQuestionCard
                key={idx}
                index={idx}
                question={q}
                selectedOptionId={answers[q.questionId]?.optionId}
                answerText={answers[q.questionId]?.answerText}
              />
            ))}
          </div>
        </>
      );
    };

    return (
      <>
        {/* Navigation tab antar view */}
        <div className="w-full flex items-center mb-6 border-b border-b-primary">
          <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                size="middle"
                onClick={() => setView(tab.key)}
                className={`relative flex items-center gap-2 !px-10 !py-1 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150
                ${
                  view === tab.key
                    ? "!bg-primary !text-white"
                    : "!bg-background hover:!bg-background-hover !text-dark"
                }`}
              >
                <span>{tab.label}</span>
                {view === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-br-primary rounded-t-sm" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full mx-0 md:max-w-[70%] lg:max-w-[60%] md:mx-auto">
          {view === "stats" ? (
            <StatsView />
          ) : view === "duration" ? (
            <DurationView />
          ) : view === "progress" ? (
            <ProgressView />
          ) : (
            <QuestionView />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {isattemptDetailDataLoading && <Loading />}

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

export default HistoryDetailPage;
