import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { StudentAttemptDetailResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptDetailResponse";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import DataTable from "../table/Table";

interface StudentAttemptViewProps {
  attempts: StudentAttemptDetailResponse[];
  actionColumns: ColumnsType<StudentAttemptDetailResponse>;
}

const StudentAttemptView = ({
  attempts,
  actionColumns,
}: StudentAttemptViewProps) => {
  /** ===== TABLE CONFIG ===== */
  const columns: ColumnsType<StudentAttemptDetailResponse> = [
    {
      title: "Attempt",
      dataIndex: "attemptNumber",
      key: "attemptNumber",
      align: "center",
      width: 50,
      fixed: "left",
    },
    {
      title: "Scope",
      dataIndex: "scope",
      align: "center",
      width: 100,
      onCell: () => ({
        style: { minWidth: 100 },
      }),
    },
    {
      title: "Class",
      dataIndex: "class",
      align: "center",
      width: 180,
      onCell: () => ({
        style: { minWidth: 180 },
      }),
      render: (cls?: { name: string; slug: string }) => (cls ? cls.name : "-"),
    },
    {
      title: "Score",
      dataIndex: "score",
      align: "center",
      width: 80,
      onCell: () => ({
        style: { minWidth: 80 },
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      width: 120,
      onCell: () => ({
        style: { minWidth: 120 },
      }),
      render: (v: TaskAttemptStatus) => <Tag>{TaskAttemptStatusLabels[v]}</Tag>,
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      align: "center",
      width: 200,
      onCell: () => ({
        style: { minWidth: 200 },
      }),
      render: (v?: Date) => (v ? new Date(v).toLocaleString() : "-"),
    },
    ...actionColumns,
  ];

  return (
    <DataTable
      columns={columns}
      data={attempts}
      rowKey="attemptId"
    />
  );
};

export default StudentAttemptView;
