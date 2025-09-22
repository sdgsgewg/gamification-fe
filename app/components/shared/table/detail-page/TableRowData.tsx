import { DetailPageTableContent } from "./DetailPageTable";

interface SubjectRowProps {
  value: string;
}

export const SubjectRow = ({ value }: SubjectRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/subject.png"
      imageAlt="Mata Pelajaran"
      label="Mata Pelajaran"
      value={value}
    />
  );
};

interface MaterialRowProps {
  value: string;
}

export const MaterialRow = ({ value }: MaterialRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/material.png"
      imageAlt="Materi Pelajaran"
      label="Materi Pelajaran"
      value={value}
    />
  );
};

interface GradeRowProps {
  value: string;
}

export const GradeRow = ({ value }: GradeRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/grade.png"
      imageAlt="Tingkatan Kelas"
      label="Ditujukan Untuk Kelas"
      value={value}
    />
  );
};

interface TaskTypeRowProps {
  value: string;
}

export const TaskTypeRow = ({ value }: TaskTypeRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/task.png"
      imageAlt="Tipe Tugas"
      label="Tipe Tugas"
      value={value}
    />
  );
};

interface QuestionCountRowProps {
  value: string;
}

export const QuestionCountRow = ({ value }: QuestionCountRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/question-count.png"
      imageAlt="Jumlah Soal"
      label="Jumlah Soal"
      value={value}
    />
  );
};

interface TimeRowProps {
  label: string;
  value?: string;
}

export const TimeRow = ({ label, value }: TimeRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/date.png"
      imageAlt={label}
      label={label}
      value={value}
    />
  );
};

interface DurationRowProps {
  value?: string;
}

export const DurationRow = ({ value }: DurationRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc="/img/duration.png"
      imageAlt="Durasi"
      label="Durasi"
      value={value}
    />
  );
};
