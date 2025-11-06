import { DetailPageTableContent } from "./DetailPageTable";
import { IMAGES } from "@/app/constants/images";

interface SubjectRowProps {
  value: string;
}

export const SubjectRow = ({ value }: SubjectRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.SUBJECT}
      imageAlt="Subject"
      label="Subject"
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
      imageSrc={IMAGES.MATERIAL}
      imageAlt="Material"
      label="Material"
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
      imageSrc={IMAGES.GRADE}
      imageAlt="Grade"
      label="Grade"
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
      imageSrc={IMAGES.TASK}
      imageAlt="Task Type"
      label="Task Type"
      value={value}
    />
  );
};

interface DifficultyRowProps {
  value: string;
}

export const DifficultyRow = ({ value }: DifficultyRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.DIFFICULTY}
      imageAlt="Difficulty"
      label="Difficulty"
      value={value}
    />
  );
};

interface NumberRowProps {
  label: string;
  value?: number | string;
}

export const NumberRow = ({ label, value }: NumberRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.NUMBER}
      imageAlt={label}
      label={label}
      value={value?.toString()}
    />
  );
};

interface DateRowProps {
  label: string;
  value?: string;
}

export const DateRow = ({ label, value }: DateRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.DATE}
      imageAlt={label}
      label={label}
      value={value}
    />
  );
};

interface TimeRowProps {
  label: string;
  value?: string | boolean;
}

export const TimeRow = ({ label, value }: TimeRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.DURATION}
      imageAlt={label}
      label={label}
      value={value}
    />
  );
};

// TASK TYPE DATA ROWS

interface ScopeRowProps {
  value?: string;
}

export const ScopeRow = ({ value }: ScopeRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.SCOPE}
      imageAlt="Scope"
      label="Scope"
      value={value}
    />
  );
};

interface IsCompetitiveProps {
  value?: boolean;
}

export const IsCompetitiveRow = ({ value }: IsCompetitiveProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.COMPETITIVE}
      imageAlt="Is Competitive"
      label="Is Competitive"
      value={value}
    />
  );
};

interface IsRepeatableRowProps {
  value?: boolean;
}

export const IsRepeatableRow = ({ value }: IsRepeatableRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.REPEATBALE}
      imageAlt="Is Repeatable"
      label="Is Repeatable"
      value={value}
    />
  );
};

// ACTIVITY DATA ROWS

interface StatusRowProps {
  value: string;
}

export const StatusRow = ({ value }: StatusRowProps) => {
  return (
    <DetailPageTableContent
      imageSrc={IMAGES.ACTIVITY_STATUS}
      imageAlt="Status Aktivitas"
      label="Status"
      value={value}
    />
  );
};
