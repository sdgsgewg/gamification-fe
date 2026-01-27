"use client";

import React from "react";
import { StudentTaskAttemptDetailAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentTaskAttemptDetailAnalyticsResponse";
import { Bar } from "@ant-design/plots";
import { StatCard } from "../Cards";
import ChartWrapper from "../ChartWrapper";
import StudentAttemptView from "@/app/components/shared/attempt/StudentAttemptView";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import { StudentAttemptDetailResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptDetailResponse";
import AttemptRowActions from "@/app/components/shared/table/AttemptRowActions";
import { ROUTES } from "@/app/constants/routes";

type Props = {
  data: StudentTaskAttemptDetailAnalyticsResponse;
};

const StudentTaskDetailAnalyticsView: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  const {
    task,
    totalAttempts,
    firstAttemptScore,
    lastAttemptScore,
    averageScore,
    improvement,
    attempts,
  } = data;

  if (!data) return null;

  const bestScore = Math.max(...attempts.map((a) => a.score));

  /** ===== CHART CONFIG ===== */
  const chartData = attempts.map((a) => ({
    attempt: `#${a.attemptNumber}`,
    score: a.score,
    isBest: a.score === bestScore,
  }));

  const chartConfig = {
    data: chartData,
    xField: "attempt",
    yField: "score",

    color: ({ isBest }: any) => (isBest ? "#52c41a" : "#1890ff"),

    label: {
      position: "middle",
      style: { fill: "#fff" },
    },

    xAxis: {
      title: {
        text: "Attempt Number",
        style: { fontSize: 12, fill: "#595959" },
      },
    },

    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Score",
        style: { fontSize: 12, fill: "#595959" },
      },
    },

    tooltip: {
      title: "Attempt",
      formatter: (datum: any) => ({
        name: "Score",
        value: datum.score,
      }),
    },

    // annotations: [
    //   {
    //     type: "line",
    //     start: [attempts[0], bestScore],
    //     end: [attempts[attempts.length - 1], bestScore],
    //     style: {
    //       stroke: "#52c41a",
    //       lineDash: [4, 4],
    //     },
    //     text: {
    //       content: "Best Score",
    //       position: "end",
    //       offsetY: -4,
    //       style: { fill: "#52c41a" },
    //     },
    //   },
    // ],

    height: 240,
  };

  const handleNavigateToReviewPage = (attemptId: string) => {
    router.push(
      `${ROUTES.DASHBOARD.STUDENT.TASKS}/attempts/${attemptId}/summary`,
    );
  };

  const handleNavigatetoAttemptPage = (
    taskSlug: string,
    classSlug?: string,
  ) => {
    const query = new URLSearchParams();
    let url = "";

    if (classSlug) {
      query.append("class", classSlug);
      query.append("task", taskSlug);
      url = `${ROUTES.DASHBOARD.STUDENT.TASKS_ATTEMPT}?${query}`;
    } else {
      url = `${ROUTES.ROOT.ACTIVITY}/${taskSlug}/attempt`;
    }

    router.push(url);
  };

  const actionColumns: ColumnsType<StudentAttemptDetailResponse> = [
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <AttemptRowActions
          record={record}
          onView={() => handleNavigateToReviewPage(record.attemptId)}
          onAttempt={() =>
            handleNavigatetoAttemptPage(record.task.slug, record.class?.slug)
          }
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ===== SUMMARY ===== */}
      <div className="rounded-xl border bg-surface p-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{data.task.title}</h2>
            {data.class && (
              <p className="text-sm text-tx-secondary">{data.class.name}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Questions" value={task.totalQuestion} />
            <StatCard label="Max Point" value={task.maxPoint} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <StatCard label="Total Attempts" value={totalAttempts} />
          <StatCard
            label="Average Score"
            value={averageScore ?? "-"}
            tooltip="Average score of all attempts that has been attempted by student"
          />
          <StatCard
            label="Best Score"
            value={bestScore}
            tooltip="Best score of all attempts"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <StatCard
            label="First Score"
            value={firstAttemptScore ?? "-"}
            tooltip="The score obtained from first attempt"
          />
          <StatCard
            label="Last Score"
            value={lastAttemptScore ?? "-"}
            tooltip="The score obtained from last attempt"
          />
          <StatCard
            label="Improvement"
            value={
              improvement
                ? `${improvement > 0 ? `+${improvement}` : `${improvement}`}`
                : "-"
            }
            tooltip="The difference between last and first attempt"
          />
        </div>
      </div>

      {/* ===== SCORE PER ATTEMPT CHART ===== */}
      <ChartWrapper
        title="Score per Attempt"
        description="This chart shows the score distribution of student per attempts"
      >
        <Bar {...chartConfig} />
      </ChartWrapper>

      {/* ===== STUDENT ATTEMPTS ===== */}
      <StudentAttemptView attempts={attempts} actionColumns={actionColumns} />
    </div>
  );
};

export default StudentTaskDetailAnalyticsView;
