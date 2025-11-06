import TableWrapper from "./TableWrapper";
import { DetailPageTableHeader } from "./DetailPageTable";
import {
  DateRow,
  DifficultyRow,
  GradeRow,
  MaterialRow,
  NumberRow,
  StatusRow,
  SubjectRow,
  TaskTypeRow,
  TimeRow,
} from "./TableRowData";
import { IMAGES } from "@/app/constants/images";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

interface DetailInformationTableProps {
  children: React.ReactNode;
}

export const DetailInformationTable = ({
  children,
}: DetailInformationTableProps) => {
  return (
    <TableWrapper>
      {/* Header */}
      <DetailPageTableHeader
        imageSrc="/img/detail-information.png"
        imageAlt="Detail Information"
        label="Detail Information"
      />

      {/* Isi */}
      {children}
    </TableWrapper>
  );
};

interface TaskDetailInformationTableProps {
  subject: string;
  material?: string;
  type: string;
  questionCount: number;
  difficulty: string;
  grade: string;
}

export const TaskDetailInformationTable = ({
  subject,
  material,
  type,
  questionCount,
  difficulty,
  grade,
}: TaskDetailInformationTableProps) => {
  return (
    <DetailInformationTable>
      <SubjectRow value={subject} />
      <MaterialRow value={material ?? ""} />
      <TaskTypeRow value={type} />
      <NumberRow label="Questions" value={questionCount} />
      <DifficultyRow value={difficulty} />
      <GradeRow value={grade} />
    </DetailInformationTable>
  );
};

interface DurationTableProps {
  startTime?: string;
  endTime?: string;
  duration?: string;
}

export const DurationTable = ({
  startTime,
  endTime,
  duration,
}: DurationTableProps) => {
  return (
    <TableWrapper>
      {/* Header */}
      <DetailPageTableHeader
        imageSrc={IMAGES.TIME}
        imageAlt="Duration"
        label="Duration"
      />

      {/* Isi */}
      <DateRow label="Start Time" value={startTime} />
      <DateRow label="Deadline" value={endTime ?? ""} />
      <TimeRow label="Duration" value={duration} />
    </TableWrapper>
  );
};

interface HistoryTableProps {
  createdBy: string;
  updatedBy?: string;
}

export const HistoryTable = ({ createdBy, updatedBy }: HistoryTableProps) => {
  return (
    <TableWrapper>
      {/* Header */}
      <DetailPageTableHeader
        imageSrc={IMAGES.DATE}
        imageAlt="History"
        label="History"
      />

      {/* Isi */}
      <DateRow label="Created By" value={createdBy} />
      <DateRow label="Last Updated" value={updatedBy ?? ""} />
    </TableWrapper>
  );
};

interface ProgressTableProps {
  startedAt: string | null;
  lastAccessedAt: string | null;
  completedAt?: string | null;
  status: string;
}

export const ProgressTable = ({
  startedAt,
  lastAccessedAt,
  completedAt,
  status,
}: ProgressTableProps) => {
  return (
    <TableWrapper>
      {/* Header */}
      <DetailPageTableHeader
        imageSrc={IMAGES.WORK_PROGRESS}
        imageAlt="Attempt Progress"
        label="Attempt Progress"
      />

      {/* Isi */}
      <DateRow label="Started At" value={startedAt ?? "-"} />
      <DateRow label="Last Accessed At" value={lastAccessedAt ?? "-"} />
      {completedAt && <DateRow label="Completed At" value={completedAt} />}
      <StatusRow value={status ?? TaskAttemptStatus.ON_PROGRESS} />
    </TableWrapper>
  );
};
