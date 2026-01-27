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
  status?: string;
}

export const TaskDetailInformationTable = ({
  subject,
  material,
  type,
  questionCount,
  difficulty,
  grade,
  status,
}: TaskDetailInformationTableProps) => {
  return (
    <DetailInformationTable>
      <SubjectRow value={subject} />
      <MaterialRow value={material ?? ""} />
      <TaskTypeRow value={type} />
      <NumberRow label="Questions" value={questionCount} />
      <DifficultyRow value={difficulty} />
      <GradeRow value={grade} />
      {status && <StatusRow value={status} />}
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
  finalizedAt?: string;
  publishedAt?: string;
  archivedAt?: string;
}

export const HistoryTable = ({
  createdBy,
  updatedBy,
  finalizedAt,
  publishedAt,
  archivedAt,
}: HistoryTableProps) => {
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
      {finalizedAt && (
        <DateRow label="Finalized At" value={finalizedAt ?? ""} />
      )}
      {publishedAt && (
        <DateRow label="Published At" value={publishedAt ?? ""} />
      )}
      {archivedAt && <DateRow label="Archived At" value={archivedAt ?? ""} />}
    </TableWrapper>
  );
};

interface ProgressTableProps {
  title?: string;
  startedAt: string | null;
  lastAccessedAt?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  duration?: string | null;
  status: string;
}

export const ProgressTable = ({
  title = "Attempt Progress",
  startedAt,
  lastAccessedAt,
  submittedAt,
  completedAt,
  duration,
  status,
}: ProgressTableProps) => {
  return (
    <TableWrapper>
      {/* Header */}
      <DetailPageTableHeader
        imageSrc={IMAGES.WORK_PROGRESS}
        imageAlt={title}
        label={title}
      />

      {/* Isi */}
      <DateRow label="Started At" value={startedAt ?? "-"} />
      {lastAccessedAt && (
        <DateRow label="Last Accessed At" value={lastAccessedAt ?? "-"} />
      )}
      {submittedAt && <DateRow label="Submitted At" value={submittedAt} />}
      {completedAt && (
        <DateRow
          label={`${submittedAt ? "Graded At" : "Completed At"}`}
          value={completedAt}
        />
      )}
      {duration && <TimeRow label="Duration" value={duration ?? "-"} />}
      <StatusRow value={status ?? TaskAttemptStatus.ON_PROGRESS} />
    </TableWrapper>
  );
};
