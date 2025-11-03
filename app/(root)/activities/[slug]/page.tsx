"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
  ActivityAttemptStatus,
  ActivityAttemptStatusLabels,
} from "@/app/enums/ActivityAttemptStatus";
import PageLayout from "../../page-layout";

const ActivityDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: activityData, isLoading: isActivityDataLoading } =
    useActivityDetail(params.slug);
  const {
    data: similarActivities = [],
    isLoading: isSimilarActivitiesLoading,
  } = useActivities({
    subjectId: activityData?.subject.subjectId,
    materialId: activityData?.material?.materialId,
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
    const { title, image, description, questionCount, attempt } = activityData;

    if (!attempt) {
      return (
        <DetailPageLeftSideContent
          name={title}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />
      );
    }

    const { lastAccessedAt, answeredCount } = attempt;

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
          <span className="text-base font-semibold ms-3">
            {lastAccessedAt && answeredCount && answeredCount < questionCount
              ? "Lanjutkan"
              : "Mulai"}
          </span>
        </Button>
      </>
    );
  };

  const RightSideContent = () => {
    const {
      subject,
      material,
      type,
      questionCount,
      grade,
      startTime,
      endTime,
      duration,
      attempt,
    } = activityData;

    if (!attempt) return;

    const { startedAt, lastAccessedAt, status } = attempt;

    const statusLabel =
      ActivityAttemptStatusLabels[status as ActivityAttemptStatus] ?? "";

    return (
      <>
        {/* Informasi Detail */}
        <DetailInformationTable>
          <SubjectRow value={subject.name} />
          <MaterialRow value={material?.name ?? ""} />
          <TaskTypeRow value={type.name} />
          <NumberRow label="Jumlah Soal" value={questionCount} />
          <GradeRow value={grade} />
        </DetailInformationTable>

        {/* Waktu Pengerjaan */}
        {(startTime || endTime || duration) && (
          <DurationTable
            startTime={getDateTime(startTime ?? null)}
            endTime={getDateTime(endTime ?? null)}
            duration={duration}
          />
        )}

        {/* Progres Pengerjaan */}
        {startedAt &&
          lastAccessedAt &&
          statusLabel !== ActivityAttemptStatusLabels["completed"] && (
            <ProgressTable
              startedAt={startedAt}
              lastAccessedAt={lastAccessedAt}
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
