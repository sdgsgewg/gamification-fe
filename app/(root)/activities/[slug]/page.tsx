"use client";

import React from "react";
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

const ActivityDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

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
    const {
      subject,
      material,
      type,
      questionCount,
      difficulty,
      grade,
      currAttempt,
      recentAttempt,
      duration,
    } = activityData;

    // duration
    const startTime = duration?.startTime ?? null;
    const endTime = duration?.endTime ?? null;
    const activityDuration = duration?.duration ?? undefined;

    // progress
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

        {/* Waktu Pengerjaan */}
        {(startTime || endTime || activityDuration) && (
          <DurationTable
            startTime={getDateTime(startTime ?? null)}
            endTime={getDateTime(endTime ?? null)}
            duration={activityDuration}
          />
        )}

        {/* Progres Pengerjaan */}
        {(currAttempt || recentAttempt) && (
          <ProgressTable
            startedAt={startedAt}
            lastAccessedAt={lastAccessedAt}
            completedAt={completedAt}
            status={statusLabel}
          />
        )}
      </>
    );
  };

  const BottomContent = () => {
    if (filteredSimilarActivities.length === 0) return null;

    return (
      <div className="flex flex-col gap-6">
        <div className="pb-2 border-b-1 border-b-dark">
          <h2 className="text-xl text-dark font-bold">Similar</h2>
        </div>

        <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-8 lg:gap-y-12 gap-x-0 xxs:gap-x-4 sm:gap-x-6 md:gap-x-12">
          {similarActivities
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
      </div>
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
