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

  const handleNavigateToTaskAttemptPage = () => {
    const query = new URLSearchParams();
    query.append("class", classSlug);
    query.append("task", taskSlug);
    const url = `${ROUTES.DASHBOARD.STUDENT.TASKS}/attempt/${query}`;
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
    const {
      subject,
      material,
      type,
      questionCount,
      grade,
      currAttempt,
      recentAttempt,
      duration,
    } = classTaskData;

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
        <DetailInformationTable>
          <SubjectRow value={subject.name} />
          <MaterialRow value={material?.name ?? ""} />
          <TaskTypeRow value={type.name} />
          <NumberRow label="Jumlah Soal" value={questionCount} />
          <GradeRow value={grade} />
        </DetailInformationTable>

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

  //   const BottomContent = () => {
  //     return (
  //       <div className="flex flex-col gap-6">
  //         <div className="pb-2 border-b-1 border-b-dark">
  //           <h2 className="text-xl text-dark font-bold">Bottom</h2>
  //         </div>
  //       </div>
  //     );
  //   };

  return (
    <>
      {isclassTaskDataLoading && <Loading />}

      <DetailPageWrapper
        left={<LeftSideContent />}
        right={<RightSideContent />}
        // bottom={<BottomContent />}
      />
    </>
  );
};

export default StudentTaskDetailPage;
