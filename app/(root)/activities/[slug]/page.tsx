"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useActivities } from "@/app/hooks/activities/useActivities";
import { useActivityDetail } from "@/app/hooks/activities/useActivityDetail";
import ActivityCard from "@/app/components/pages/Activity/ActivityCard";
import { IMAGES } from "@/app/constants/images";
import StatusBar from "@/app/components/shared/StatusBar";
import Button from "@/app/components/shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import PageLayout from "../../page-layout";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import TaskDetailPageBottomContentWrapper from "@/app/components/shared/detail-page/TaskDetailPageBottomContentWrapper";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";
import NotFound from "@/app/components/shared/NotFound";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";

const ActivityDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useGetCachedUser();

  const { data: activityData, isLoading: isActivityDataLoading } =
    useActivityDetail(params.slug);
  const {
    data: similarActivities = [],
    isLoading: isSimilarActivitiesLoading,
  } = useActivities({
    subjectId: activityData?.subject.id,
    materialId: activityData?.material?.id,
  });
  const filteredSimilarActivities = similarActivities.filter(
    (activity) => activity.slug !== params.slug
  );

  const handleNavigateToActivityAttemptPage = () => {
    router.push(`${ROUTES.ROOT.ACTIVITYATTEMPT}/${params.slug}`);
  };

  if (!activityData) {
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
    } = activityData;

    // === Tentukan teks & visibilitas tombol ===
    let buttonLabel: string | null = null;

    if (currAttempt) {
      buttonLabel = "Lanjutkan";
    } else if (recentAttempt) {
      if (type.isRepeatable) {
        buttonLabel = "Repeat";
      } else {
        buttonLabel = null; // Tidak render tombol
      }
    } else {
      buttonLabel = "Start";
    }

    const shouldShowButton = buttonLabel !== null && user !== undefined;

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
            onClick={handleNavigateToActivityAttemptPage}
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
      activityData;

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
    const [view, setView] =
      useState<TaskDetailBottomContentView>("similar-activities");

    const { currAttempt, recentAttempt, duration } = activityData;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      { key: "similar-activities" as const, label: "Similar" },
      { key: "duration" as const, label: "Duration" },
      ...(user ? [{ key: "progress" as const, label: "Progres" }] : []),
    ];

    const handleChangeTab = (key: TaskDetailBottomContentView) => {
      setView(key);
    };

    const SimilarActivitiesView = () => {
      return (
        <div className="flex flex-col">
          {filteredSimilarActivities && filteredSimilarActivities.length > 0 ? (
            <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-8 lg:gap-y-12 gap-x-0 xxs:gap-x-4 sm:gap-x-6 md:gap-x-12">
              {filteredSimilarActivities
                .filter((sa) => sa.slug !== activityData.slug) // exclude current activity
                .map((sa) => (
                  <ActivityCard
                    key={sa.id}
                    type={sa.type}
                    image={sa.image ?? ""}
                    title={sa.title}
                    slug={sa.slug}
                    subject={sa.subject}
                    grade={sa.grade}
                    questionCount={sa.questionCount}
                  />
                ))}
            </div>
          ) : (
            <NotFound text="No Activity Found" />
          )}
        </div>
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

    return (
      <TaskDetailPageBottomContentWrapper
        tabs={tabs}
        view={view}
        onChangeTab={handleChangeTab}
      >
        {view === "similar-activities" ? (
          <SimilarActivitiesView />
        ) : view === "duration" ? (
          <DurationView />
        ) : view === "progress" ? (
          <ProgressView />
        ) : (
          <></>
        )}
      </TaskDetailPageBottomContentWrapper>
    );
  };

  return (
    <>
      {isActivityDataLoading || (isSimilarActivitiesLoading && <Loading />)}

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

export default ActivityDetailPage;
