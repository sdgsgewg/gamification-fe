import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { StudentAttemptDetailResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptDetailResponse";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import AttemptRowActions from "../table/AttemptRowActions";

interface StudentAttemptViewProps {
  attempts: StudentAttemptDetailResponse[];
  actionColumns: ColumnsType<StudentAttemptDetailResponse>;
  onView?: () => void;
  onContinue?: () => void;
  onGrade?: () => void;
}

const StudentAttemptView = ({
  attempts,
  actionColumns,
  onView,
  onContinue,
  onGrade,
}: StudentAttemptViewProps) => {
  /** ===== TABLE CONFIG ===== */
  const columns: ColumnsType<StudentAttemptDetailResponse> = [
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
    ...actionColumns,
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={attempts}
      rowKey="attemptId"
      pagination={false}
    />
  );
};

export default StudentAttemptView;
