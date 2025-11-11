"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import {
  DetailInformationTable,
  ProgressTable,
  TaskDetailInformationTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { TaskDetailBottomContentView } from "@/app/types/TaskDetailBottomContentView";
import TaskDetailPageBottomContentWrapper from "@/app/components/shared/detail-page/TaskDetailPageBottomContentWrapper";
import { useTaskSubmissionDetail } from "@/app/hooks/task-submissions/useTaskSubmissionDetail";
import { IMAGES } from "@/app/constants/images";
import StatusBar from "@/app/components/shared/StatusBar";
import { TaskSubmissionStatus } from "@/app/enums/TaskSubmissionStatus";
import Button from "@/app/components/shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { TaskSummaryQuestionCard } from "@/app/components/shared/cards";
import {
  FeedbackRow,
  NumberRow,
} from "@/app/components/shared/table/detail-page/TableRowData";

const SubmissionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.SUBMISSIONS;

  const { data: submissionDetail, isLoading } = useTaskSubmissionDetail(
    params.id
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Prefill answers ketika attemptDetailData berhasil dimuat
  useEffect(() => {
    if (!submissionDetail) return;

    // Hanya jalankan prefill kalau ada attempt sebelumnya

    const prefilledAnswers: Record<string, any> = {};

    submissionDetail.questions.forEach((q) => {
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
  }, [submissionDetail]);

  if (!submissionDetail) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { title, image, description } = submissionDetail.taskDetail;
    const { reviewedQuestionCount, totalQuestionCount, status } =
      submissionDetail.progress;

    // === Tentukan teks & visibilitas tombol ===
    let buttonLabel: string | null = null;

    if (status === TaskSubmissionStatus.ON_PROGRESS) {
      buttonLabel = "Continue";
    } else {
      buttonLabel = "Review";
    }

    const shouldShowButton = buttonLabel !== null;

    const handleNavigateToSubmissionReviewPage = () => {
      router.push(`${baseRoute}/${params.id}/review`);
    };

    return (
      <>
        <DetailPageLeftSideContent
          name={title}
          image={image !== "" ? image : IMAGES.ACTIVITY}
          description={description}
        />

        {/* Status Pengerjaan (untuk section "Lanjut Mengerjakan") */}
        {status === TaskSubmissionStatus.ON_PROGRESS && (
          <StatusBar
            current={reviewedQuestionCount}
            total={totalQuestionCount}
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
            onClick={handleNavigateToSubmissionReviewPage}
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
      submissionDetail.taskDetail;

    return (
      <>
        {/* Informasi Detail */}
        <TaskDetailInformationTable
          subject={subject}
          material={material}
          type={type}
          questionCount={questionCount}
          difficulty={difficulty}
          grade={grade}
        />
      </>
    );
  };

  const BottomContent = () => {
    const [view, setView] =
      useState<TaskDetailBottomContentView>("submission-summary");

    const { summary, progress, questions } = submissionDetail;
    const { finishGradedAt } = progress;
    const isCompleted = finishGradedAt ?? false;

    // Buat daftar tab dinamis
    const tabs: { key: TaskDetailBottomContentView; label: string }[] = [
      // ...(isCompleted
      //   ? [{ key: "submission-summary" as const, label: "Summary" }]
      //   : []),
      { key: "submission-summary" as const, label: "Summary" },
      { key: "submission-progress" as const, label: "Progress" },
      { key: "questions" as const, label: "Questions" },
    ];

    const handleChangeTab = (key: TaskDetailBottomContentView) => {
      setView(key);
    };

    const SummaryView = () => {
      const { score, feedback, pointGained, totalPoints, xpGained } = summary;

      return (
        <DetailInformationTable>
          <NumberRow
            label="Point Gained"
            value={pointGained ? `${pointGained}/${totalPoints}` : "-"}
          />
          <NumberRow label="Score" value={score} />
          <NumberRow label="XP Gained" value={xpGained} />
          <FeedbackRow value={feedback} />
        </DetailInformationTable>
      );
    };

    const ProgressView = () => {
      const { startGradedAt, lastGradedAt, finishGradedAt, status } = progress;

      return (
        <ProgressTable
          startedAt={startGradedAt}
          lastAccessedAt={lastGradedAt}
          completedAt={finishGradedAt}
          status={status}
        />
      );
    };

    const QuestionView = () => {
      if (!questions) return;

      return (
        <>
          <h2 className="text-dark font-semibold text-2xl mb-4">Daftar Soal</h2>

          <div className="flex flex-col gap-8">
            {questions.map((q, idx) => (
              <TaskSummaryQuestionCard
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
      <TaskDetailPageBottomContentWrapper
        tabs={tabs}
        view={view}
        onChangeTab={handleChangeTab}
      >
        {view === "submission-summary" ? (
          <SummaryView />
        ) : view === "submission-progress" ? (
          <ProgressView />
        ) : (
          <QuestionView />
        )}
      </TaskDetailPageBottomContentWrapper>
    );
  };

  return (
    <>
      {isLoading && <Loading />}

      <DashboardTitle showBackButton={true} />

      {submissionDetail && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
        />
      )}
    </>
  );
};

export default SubmissionDetailPage;
