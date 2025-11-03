import TableWrapper from "./TableWrapper";
import { DetailPageTableHeader } from "./DetailPageTable";
import { DateRow, StatusRow, TimeRow } from "./TableRowData";
import { IMAGES } from "@/app/constants/images";
import { ActivityAttemptStatus } from "@/app/enums/ActivityAttemptStatus";

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
        label="Informasi Detail"
      />

      {/* Isi */}
      {children}
    </TableWrapper>
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
        imageAlt="Waktu Pengerjaan"
        label="Waktu Pengerjaan"
      />

      {/* Isi */}
      <DateRow label="Waktu Mulai" value={startTime} />
      <DateRow label="Waktu Selesai" value={endTime ?? ""} />
      <TimeRow label="Durasi" value={duration} />
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
        imageAlt="Riwayat"
        label="Riwayat"
      />

      {/* Isi */}
      <DateRow label="Dibuat Oleh" value={createdBy} />
      <DateRow label="Terkahir Diperbarui" value={updatedBy ?? ""} />
    </TableWrapper>
  );
};

interface ProgressTableProps {
  startedTime: string;
  lastAccessedTime: string;
  status?: string;
}

export const ProgressTable = ({
  lastAccessedTime,
  startedTime,
  status,
}: ProgressTableProps) => {
  return (
    <TableWrapper>
      {/* Header */}
      <DetailPageTableHeader
        imageSrc={IMAGES.WORK_PROGRESS}
        imageAlt="Progres Pengerjaan"
        label="Progres Pengerjaan"
      />

      {/* Isi */}
      <DateRow label="Mulai Kerja" value={startedTime} />
      <DateRow label="Terakhir Diakses" value={lastAccessedTime} />
      <StatusRow value={status ?? ActivityAttemptStatus.ON_PROGRESS} />
    </TableWrapper>
  );
};
