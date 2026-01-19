"use client";

import React from "react";
import { Modal, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { StudentTaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentTaskAttemptAnalyticsResponse";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { Bar } from "@ant-design/plots";

type Props = {
  open: boolean;
  onClose: () => void;
  student: StudentTaskAttemptAnalyticsResponse | null;
};

const StudentAttemptAnalyticsModal: React.FC<Props> = ({
  open,
  onClose,
  student,
}) => {
  if (!student) return null;

  const bestScore = Math.max(...student.attempts.map((a) => a.score));

  /** ===== CHART CONFIG ===== */
  const chartData = student.attempts.map((a) => ({
    attempt: `#${a.attemptNumber}`,
    score: a.score,
    isBest: a.score === bestScore,
  }));

  const attempts = chartData.map((d) => d.attempt);

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

  /** ===== TABLE CONFIG ===== */
  const columns: ColumnsType<any> = [
    {
      title: "Attempt",
      dataIndex: "attemptNumber",
      align: "center",
    },
    {
      title: "Score",
      dataIndex: "score",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (v: TaskAttemptStatus) => <Tag>{TaskAttemptStatusLabels[v]}</Tag>,
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      align: "center",
      render: (v?: Date) => (v ? new Date(v).toLocaleString() : "-"),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={`Attempt Analytics — ${student.studentName}`}
    >
      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Attempts" value={student.totalAttempts} />
        <Stat label="First Score" value={student.firstAttemptScore ?? "-"} />
        <Stat label="Last Score" value={student.lastAttemptScore ?? "-"} />
        <Stat label="Best Score" value={bestScore} />
      </div>

      {/* ===== CHART ===== */}
      <div className="mb-6">
        <Bar {...chartConfig} />
      </div>

      {/* ===== TABLE ===== */}
      <Table
        size="small"
        columns={columns}
        dataSource={student.attempts}
        rowKey="attemptId"
        pagination={false}
      />
    </Modal>
  );
};

const Stat = ({ label, value }: { label: string; value: any }) => (
  <div className="rounded-lg bg-background p-3 text-center border">
    <p className="text-sm text-tx-secondary">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default StudentAttemptAnalyticsModal;
