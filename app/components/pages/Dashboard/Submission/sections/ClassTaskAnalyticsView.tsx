"use client";

import React from "react";
import DataTable from "@/app/components/shared/table/Table";
import {
  ClassTaskAttemptAnalyticsResponseDto,
  StudentTaskAttemptAnalyticsDto,
} from "@/app/interface/task-submissions/responses/IClassTaskAttemptAnalyticsResponse";
import { Tag, Tooltip } from "antd";
import RowActions from "@/app/components/shared/table/RowActions";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { ColumnType } from "antd/es/table";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";

type Props = {
  data: ClassTaskAttemptAnalyticsResponseDto;
};

const ClassTaskAnalyticsView: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.SUBMISSIONS;

  const handleView = (submissionId: string) => {
    router.push(`${baseRoute}/${submissionId}`);
  };

  const columns: ColumnType<StudentTaskAttemptAnalyticsDto>[] = [
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
      width: 100,
      onCell: () => ({
        style: { minWidth: 100 },
      }),
      render: (_, record) => {
        <RowActions
          onView={
            record.latestSubmissionId
              ? () => handleView(record.latestSubmissionId)
              : undefined
          }
        />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ===== SUMMARY ===== */}
      <div className="rounded-xl border bg-surface p-4 shadow-sm">
        <h2 className="text-lg font-semibold">{data.taskTitle}</h2>
        <p className="text-sm text-tx-secondary">{data.className}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Stat label="Students" value={data.students.length} />
          <Stat label="Avg Attempts / Student" value={data.averageAttempts} />
          <Stat
            label="Avg Score (All Attempts)"
            value={data.averageScoreAllStudents}
          />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <DataTable
        title="Student Attempt Analytics"
        columns={columns}
        data={data.students}
        rowKey="studentId"
        searchable
        searchPlaceholder="Search student"
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

export default ClassTaskAnalyticsView;
