import { ActivityAttemptStatus } from "@/app/enums/ActivityAttemptStatus";

interface TaskType {
  name: string;
  isRepeatable: boolean;
}

interface Attempt {
  answeredCount?: number;
}

interface TaskAttemptStats {
  pointGained: number;
  totalPoints: number;
  xpGained: number;
  score: number;
}

interface TaskDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

interface TaskAttemptProgress {
  startedAt: string;
  lastAccessedAt: string;
  completedAt: string;
  status: ActivityAttemptStatus;
}

interface AnswerLog {
  answerLogId: string | null;
  text: string | null;
  image: string | null;
  optionId: string | null;
  isCorrect: boolean | null;
}

interface QuestionOption {
  optionId: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export interface Question {
  questionId: string;
  text: string;
  point: number;
  type: string;
  timeLimit?: number;
  image?: string;
  options?: QuestionOption[];
  userAnswer?: AnswerLog;
}

export interface TaskAttemptDetailResponse {
  title: string;
  slug: string;
  image?: string;
  description: string;
  subject: string;
  material: string;
  grade: string;
  questionCount: number;
  createdBy: string;
  type: TaskType;
  attempt?: Attempt;
  stats: TaskAttemptStats;
  duration?: TaskDuration;
  progress: TaskAttemptProgress;
  questions: Question[];
}
