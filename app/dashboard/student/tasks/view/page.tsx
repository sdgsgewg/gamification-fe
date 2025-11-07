"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import {
  GradeRow,
  MaterialRow,
  NumberRow,
  SubjectRow,
  TaskTypeRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  DurationTable,
  ProgressTable,
  TaskDetailInformationTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { getDateTime } from "@/app/utils/date";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { IMAGES } from "@/app/constants/images";
import StatusBar from "@/app/components/shared/StatusBar";
import Button from "@/app/components/shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useClassTaskDetail } from "@/app/hooks/class-tasks/useClassTaskDetail";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";
import ActivityQuestionCard from "@/app/components/pages/Activity/Summary/ActivityQuestionCard";

const StudentTaskDetailPage = () => {
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

  const { data: classTaskData, isLoading: isclassTaskDataLoading } =
    useClassTaskDetail(classSlug, taskSlug);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Prefill answers ketika attemptDetailData berhasil dimuat
  useEffect(() => {
    if (!classTaskData) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya

    const prefilledAnswers: Record<string, any> = {};

    classTaskData.questions.forEach((q) => {
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
  }, [classTaskData]);

  const handleNavigateToTaskAttemptPage = () => {
    const query = new URLSearchParams();
    query.append("class", classSlug);
    query.append("task", taskSlug);
    const url = `${ROUTES.DASHBOARD.STUDENT.TASKS_ATTEMPT}?${query}`;
    router.push(url);
  };

  if (!classTaskData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const {
      title,
      image,
      description,
      questionCount,
      type,
      currAttempt,
      recentAttempt,
    } = classTaskData;

    // === Tentukan teks & visibilitas tombol ===
    let buttonLabel: string | null = null;

    if (currAttempt) {
      buttonLabel = "Lanjutkan";
    } else if (recentAttempt) {
      if (type.isRepeatable) {
        buttonLabel = "Kerja Ulang";
      } else {
        buttonLabel = null; // Tidak render tombol
      }
    } else {
      buttonLabel = "Mulai";
    }

    const shouldShowButton = buttonLabel !== null;

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />

        {/* Status Pengerjaan (untuk section "Lanjut Mengerjakan") */}
        {currAttempt && (
          <StatusBar
            current={currAttempt.answeredCount}
            total={questionCount}
            labelClassName="text-base font-medium"
            bgClassName="bg-white"
            height={"h-6"}
          />
        )}

        {/* Tombol hanya muncul jika sesuai kondisi */}
        {shouldShowButton && (
          <Button
            type="primary"
            size="large"
            variant="primary"
            className="!py-4 !px-6 !rounded-[1.5rem]"
            onClick={handleNavigateToTaskAttemptPage}
          >
            <FontAwesomeIcon icon={faPlay} />
            <span className="text-base font-semibold ms-3">{buttonLabel}</span>
          </Button>
        )}
      </>
    );
  };

  const RightSideContent = () => {
    const { subject, material, type, questionCount, difficulty, grade } =
      classTaskData;

    return (
      <>
        {/* Informasi Detail */}
        <TaskDetailInformationTable
          subject={subject.name}
          material={material?.name}
          type={type.name}
          questionCount={questionCount}
          difficulty={difficulty}
          grade={grade}
        />
      </>
    );
  };

  const BottomContent = () => {
    const [view, setView] = useState<TaskDetailBottomContentView>("stats");

    const { duration, currAttempt, recentAttempt } = classTaskData;
    const isCompleted =
      recentAttempt?.status === TaskAttemptStatus.COMPLETED ? true : false;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      ...(isCompleted ? [{ key: "stats" as const, label: "Statistics" }] : []),
      { key: "duration" as const, label: "Duration" },
      { key: "progress" as const, label: "Progres" },
      ...(isCompleted
        ? [{ key: "questions" as const, label: "Questions" }]
        : []),
    ];

    // Jika view aktif tidak tersedia lagi (misal user di stats tapi belum completed), fallback ke "progress"
    useEffect(() => {
      if (!isCompleted && (view === "stats" || view === "questions")) {
        setView("progress");
      }
    }, [isCompleted, view]);

    const StatsView = () => {
      const { pointGained, totalPoints, xpGained, score } = classTaskData.stats;

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
      const startedAt = currAttempt
        ? currAttempt.startedAt
        : recentAttempt
        ? recentAttempt.startedAt
        : null;
      const lastAccessedAt = currAttempt
        ? currAttempt.lastAccessedAt
        : recentAttempt
        ? recentAttempt.lastAccessedAt
        : null;
      const completedAt = recentAttempt ? recentAttempt.completedAt : null;
      const statusLabel = currAttempt
        ? TaskAttemptStatusLabels[currAttempt.status as TaskAttemptStatus]
        : recentAttempt
        ? TaskAttemptStatusLabels[recentAttempt.status as TaskAttemptStatus]
        : "";

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
            {classTaskData.questions.map((q, idx) => (
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
      {isclassTaskDataLoading && <Loading />}

      <DashboardTitle title="Detail Tugas" showBackButton={true} />

      <DetailPageWrapper
        left={<LeftSideContent />}
        right={<RightSideContent />}
        bottom={<BottomContent />}
      />
    </>
  );
};

export default StudentTaskDetailPage;
