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
import { Status, StatusLabels } from "@/app/enums/Status";

const ActivityDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.ROOT.ACTIVITY;

  const { data: activityData, isLoading: isActivityDataLoading } =
    useActivityDetail(params.slug);
  const {
    data: similarActivities = [],
    isLoading: isSimilarActivitiesLoading,
  } = useActivities({
    subjectId: activityData?.subject.subjectId,
    materialId: activityData?.material?.materialId,
    taskTypeId: activityData?.type.taskTypeId,
  });

  if (!activityData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const {
      title,
      image,
      description,
      questionCount,
      answeredCount,
      lastAccessedTime,
    } = activityData;

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />

        {/* Status Pengerjaan (untuk section "Lanjut Mengerjakan") */}
        {lastAccessedTime && (
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
        >
          <FontAwesomeIcon icon={faPlay} />
          <span className="text-base font-semibold ms-3">
            {lastAccessedTime ? "Lanjutkan" : "Mulai"}
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
      lastAccessedTime,
      completedTime,
      status,
    } = activityData;

    const statusLabel = StatusLabels[status as Status] ?? "";

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
        <DurationTable
          startTime={getDateTime(startTime ?? null)}
          endTime={getDateTime(endTime ?? null)}
          duration={duration}
        />

        {/* Progres Pengerjaan */}
        {lastAccessedTime && (
          <ProgressTable
            lastAccessedTime={lastAccessedTime}
            completedTime={completedTime}
            status={statusLabel}
          />
        )}
      </>
    );
  };

  const BottomContent = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="pb-2 border-b-1 border-b-black">
          <h2 className="text-xl text-black font-bold">Similar</h2>
        </div>

        <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-8 lg:gap-y-12 gap-x-0 xxs:gap-x-4 sm:gap-x-8 md:gap-x-12">
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

      <div className="w-full pt-12 pb-16 px-4 sm:px-8 md:px-12 lg:px-16">
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
        />
      </div>
    </>
  );
};

export default ActivityDetailPage;
