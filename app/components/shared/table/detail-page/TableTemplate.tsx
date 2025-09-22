import TableWrapper from "./TableWrapper";
import { DetailPageTableHeader } from "./DetailPageTable";
import { DurationRow, TimeRow } from "./TableRowData";

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
        imageSrc="/img/time.png"
        imageAlt="Waktu Pengerjaan"
        label="Waktu Pengerjaan"
      />

      {/* Isi */}
      <TimeRow label="Waktu Mulai" value={startTime} />
      <TimeRow label="Waktu Selesai" value={endTime ?? ""} />
      <DurationRow value={duration} />
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
        imageSrc="/img/date.png"
        imageAlt="Riwayat"
        label="Riwayat"
      />

      {/* Isi */}
      <TimeRow label="Dibuat Oleh" value={createdBy} />
      <TimeRow label="Terkahir Diperbarui" value={updatedBy ?? ""} />
    </TableWrapper>
  );
};
