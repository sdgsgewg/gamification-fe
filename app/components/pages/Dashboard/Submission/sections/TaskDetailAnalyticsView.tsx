"use client";

import React, { useState } from "react";
import DataTable from "@/app/components/shared/table/Table";
import { Tag } from "antd";
import RowActions from "@/app/components/shared/table/RowActions";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { ColumnType } from "antd/es/table";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import StudentAttemptAnalyticsModal from "../../../../modals/StudentAttemptAnalyticsModal";
import { Line } from "@ant-design/plots";
import { TaskAttemptDetailAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/ITaskAttemptDetailAnalyticsResponse";
import { StudentAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptAnalyticsResponse";
import ChartWrapper from "../ChartWrapper";

type Props = {
  data: TaskAttemptDetailAnalyticsResponse;
};

const TaskDetailAnalyticsView: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.SUBMISSIONS;

  const [selectedStudent, setSelectedStudent] =
    useState<StudentAttemptAnalyticsResponse | null>(null);

  const handleView = (student: StudentAttemptAnalyticsResponse) => {
    setSelectedStudent(student);
  };

  const handleGrade = (submissionId: string) => {
    router.push(`${baseRoute}/${submissionId}`);
  };

  const columns: ColumnType<StudentAttemptAnalyticsResponse>[] = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      width: 100,
      fixed: "left",
    },
    {
      title: "Attempts",
      dataIndex: "totalAttempts",
      key: "totalAttempts",
      align: "center",
      width: 80,
      onCell: () => ({
        style: { minWidth: 80 },
      }),
    },
    {
      title: "First Score",
      dataIndex: "firstAttemptScore",
      key: "firstAttemptScore",
      align: "center",
      width: 100,
      onCell: () => ({
        style: { minWidth: 100 },
      }),
      render: (v?: number) => v ?? "-",
    },
    {
      title: "Last Score",
      dataIndex: "lastAttemptScore",
      key: "lastAttemptScore",
      align: "center",
      width: 100,
      onCell: () => ({
        style: { minWidth: 100 },
      }),
      render: (v?: number) => v ?? "-",
    },
    {
      title: "Avg Score",
      dataIndex: "averageScore",
      key: "averageScore",
      align: "center",
      width: 100,
      onCell: () => ({
        style: { minWidth: 100 },
      }),
      render: (v?: number) => (v !== undefined ? v.toFixed(2) : "-"),
    },
    {
      title: "Improvement",
      dataIndex: "improvement",
      key: "improvement",
      align: "center",
      width: 120,
      onCell: () => ({
        style: { minWidth: 120 },
      }),
      render: (value?: number) => {
        if (value === undefined) return "-";
        if (value > 0) return <Tag color="green">+{value}</Tag>;
        if (value < 0) return <Tag color="red">{value}</Tag>;
        return <Tag>0</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "latestStatus",
      key: "latestStatus",
      align: "center",
      width: 120,
      onCell: () => ({
        style: { minWidth: 120 },
      }),
      render: (v?: TaskAttemptStatus) =>
        v !== undefined ? TaskAttemptStatusLabels[v] : "-",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <RowActions
          onView={() => handleView(record)}
          onGrade={
            record.latestSubmissionId
              ? () => handleGrade(record.latestSubmissionId)
              : undefined
          }
        />
      ),
    },
  ];

  const averageAttemptChartData = data.attempts
    .filter((a) => a.averageScore !== undefined)
    .map((a) => ({
      attempt: `#${a.attemptNumber}`,
      averageScore: a.averageScore!,
    }));

  const averageAttemptChartConfig = {
    data: averageAttemptChartData,
    xField: "attempt",
    yField: "averageScore",

    smooth: true,

    point: {
      size: 5,
      shape: "circle",
    },

    lineStyle: {
      lineWidth: 2,
    },

    xAxis: {
      title: {
        text: "Attempt Number",
      },
    },

    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Average Score",
      },
    },

    tooltip: {
      title: "Attempt",
      formatter: (datum: any) => ({
        name: "Score",
        value: datum.score,
      }),
    },

    height: 260,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ===== SUMMARY ===== */}
      <div className="rounded-xl border bg-surface p-4 shadow-sm">
        <h2 className="text-lg font-semibold">{data.task.title}</h2>
        {data.class && (
          <p className="text-sm text-tx-secondary">{data.class.name}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Stat label="Students" value={data.students.length} />
          <Stat label="Avg Attempts / Student" value={data.averageAttempts} />
          <Stat
            label="Avg Score (All Attempts)"
            value={data.averageScoreAllStudents}
          />
        </div>
      </div>

      {/* ===== AVERAGE ATTEMPT CHART ===== */}
      {averageAttemptChartData.length > 0 && (
        <ChartWrapper
          title="Average Scre per Attempt"
          description="This chart shows the average score distribution of all students per attempts"
        >
          <Line {...averageAttemptChartConfig} />
        </ChartWrapper>
      )}

      {/* ===== TABLE ===== */}
      <DataTable
        title="Student Attempt Analytics"
        columns={columns}
        data={data.students}
        rowKey="studentId"
        searchable
        searchPlaceholder="Search student"
      />

      <StudentAttemptAnalyticsModal
        open={!!selectedStudent}
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-background p-3 text-center">
    <p className="text-sm text-tx-secondary">{label}</p>
    <p className="text-xl font-semibold text-dark">{value}</p>
  </div>
);

export default TaskDetailAnalyticsView;
