"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import {
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
import { AttemptCard, AttemptCardWrapper } from "@/app/components/shared/cards";
import TaskDetailPageBottomContentWrapper from "@/app/components/shared/detail-page/TaskDetailPageBottomContentWrapper";

export const dynamic = "force-dynamic";

const StudentTaskDetailPageContent = () => {
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
    const { currAttempt, recentAttempts } = classTaskData;
    const { title, subtitle, image, description, questionCount, type } =
      classTaskData.taskDetail;

    // === Tentukan teks & visibilitas tombol ===
    let buttonLabel: string | null = null;

    if (currAttempt) {
      buttonLabel = "Continue";
    } else if (recentAttempts && recentAttempts.length > 0) {
      if (type.isRepeatable) {
        buttonLabel = "Re-Attempt";
      } else {
        buttonLabel = null; // Tidak render tombol
      }
    } else {
      buttonLabel = "Start";
    }

    const shouldShowButton = buttonLabel !== null;

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          additionalText={subtitle}
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
      classTaskData.taskDetail;

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
    const [view, setView] = useState<TaskDetailBottomContentView>("duration");

    const { duration, currAttempt, recentAttempts } = classTaskData;

    const showCurrAttempt =
      currAttempt !== null && recentAttempts?.length === 0;
    const hasRecentAttempts = recentAttempts && recentAttempts.length > 0;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      { key: "duration" as const, label: "Duration" },
      ...(showCurrAttempt
        ? [{ key: "progress" as const, label: "Progress" }]
        : []),
      ...(hasRecentAttempts
        ? [{ key: "attempts" as const, label: "Attempts" }]
        : []),
    ];

    const handleChangeTab = (key: TaskDetailBottomContentView) => {
      setView(key);
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
      const startedAt = currAttempt ? currAttempt.startedAt : null;
      const lastAccessedAt = currAttempt ? currAttempt.lastAccessedAt : null;
      const statusLabel = currAttempt
        ? TaskAttemptStatusLabels[currAttempt.status as TaskAttemptStatus]
        : "";

      return (
        <ProgressTable
          startedAt={startedAt}
          lastAccessedAt={lastAccessedAt}
          status={statusLabel}
        />
      );
    };

    const AttemptsView = () => {
      if (!hasRecentAttempts) return null;

      const handleNavigateToReviewPage = (attemptId: string) => {
        router.push(
          `${ROUTES.DASHBOARD.STUDENT.TASKS}/attempts/${attemptId}/summary`
        );
      };

      return (
        <AttemptCardWrapper>
          {recentAttempts.map((attempt, index) => (
            <AttemptCard
              key={index}
              index={index}
              id={attempt.id}
              startedAt={attempt.startedAt}
              completedAt={attempt.completedAt}
              duration={attempt.duration}
              status={attempt.status}
              onClick={handleNavigateToReviewPage}
            />
          ))}
        </AttemptCardWrapper>
      );
    };

    return (
      <TaskDetailPageBottomContentWrapper
        tabs={tabs}
        view={view}
        onChangeTab={handleChangeTab}
      >
        {view === "duration" ? (
          <DurationView />
        ) : view === "progress" ? (
          <ProgressView />
        ) : (
          <AttemptsView />
        )}
      </TaskDetailPageBottomContentWrapper>
    );
  };

  return (
    <>
      {isclassTaskDataLoading && <Loading />}

      <DashboardTitle title="Task Detail" showBackButton={true} />

      <DetailPageWrapper
        left={<LeftSideContent />}
        right={<RightSideContent />}
        bottom={<BottomContent />}
      />
    </>
  );
};

export default function StudentTaskDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StudentTaskDetailPageContent />
    </Suspense>
  );
}
